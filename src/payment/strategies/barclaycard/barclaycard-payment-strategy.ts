import { CheckoutStore, InternalCheckoutSelectors } from '../../../checkout';
import { OrderActionCreator, OrderRequestBody } from '../../../order';
import { OrderFinalizationNotRequiredError } from '../../../order/errors';
import { PaymentArgumentInvalidError } from '../../errors';
import PaymentActionCreator from '../../payment-action-creator';
import { PaymentRequestOptions } from '../../payment-request-options';
import * as paymentStatusTypes from '../../payment-status-types';
import PaymentStrategy from '../payment-strategy';

import { BrowserInfoRequest, DeviceOS } from './barclaycard';

export default class BarclaycardPaymentStrategy implements PaymentStrategy {
    constructor(
        private _store: CheckoutStore,
        private _orderActionCreator: OrderActionCreator,
        private _paymentActionCreator: PaymentActionCreator
    ) { }

    async execute(payload: OrderRequestBody, options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
        const { payment } = payload;

        if (!payment) {
            throw new PaymentArgumentInvalidError(['payment']);
        }

        const { paymentData } = payment;

        await this._store.dispatch(this._orderActionCreator.submitOrder(payload, options));

        return await this._store.dispatch(this._paymentActionCreator.initializeOffsitePayment(
            payment.methodId,
            payment.gatewayId,
            {
                ...paymentData,
                formattedPayload: {
                    browser_info: this._getBrowserInfo(),
                },
            }));
    }

    finalize(options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
        const state = this._store.getState();
        const order = state.order.getOrder();
        const status = state.payment.getPaymentStatus();

        if (order && (status === paymentStatusTypes.ACKNOWLEDGE || status === paymentStatusTypes.FINALIZE)) {
            return this._store.dispatch(this._orderActionCreator.finalizeOrder(order.orderId, options));
        }

        return Promise.reject(new OrderFinalizationNotRequiredError());
    }

    initialize(): Promise<InternalCheckoutSelectors> {
        return Promise.resolve(this._store.getState());
    }

    deinitialize(): Promise<InternalCheckoutSelectors> {
        return Promise.resolve(this._store.getState());
    }

    private _getBrowserInfo(): BrowserInfoRequest {
        return {
            device_os: this._getDeviceOs(),
            language: navigator.language || navigator.languages[0],
            screen_resolution: `${screen.width}x${screen.height}`,
            time_zone: new Date().toLocaleTimeString('en-us', {timeZoneName: 'short'}).split(' ')[2],
        };
    }

    private _getDeviceOs(): DeviceOS {
        let deviceOS: DeviceOS = DeviceOS.Other;
        if (navigator.userAgent.indexOf('Win') !== -1) {
            deviceOS = DeviceOS.Windows;
        } else if (navigator.userAgent.indexOf('like Mac') !== -1) {
            deviceOS = DeviceOS.IOS;
        } else if (navigator.userAgent.indexOf('Android') !== -1) {
            deviceOS = DeviceOS.Android;
        }

        return deviceOS;
    }
}

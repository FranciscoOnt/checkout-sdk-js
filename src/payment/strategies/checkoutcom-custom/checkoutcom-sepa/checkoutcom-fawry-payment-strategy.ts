import { InternalCheckoutSelectors } from '../../../../checkout';
import { OrderRequestBody } from '../../../../order';
import { PaymentArgumentInvalidError } from '../../../errors';
import { CheckoutcomFawryInstrument, PaymentInstrument } from '../../../payment';
import { PaymentRequestOptions } from '../../../payment-request-options';
import CheckoutcomCustomPaymentStrategy from '../checkoutcom-custom-payment-strategy';

export default class CheckoutcomFawryPaymentStrategy extends CheckoutcomCustomPaymentStrategy {

    protected async _executeWithoutHostedForm(payload: OrderRequestBody, options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
        const { payment, ...order } = payload;
        const paymentData = payment && payment.paymentData;

        if (!payment || !paymentData) {
            throw new PaymentArgumentInvalidError(['payment.paymentData']);
        }

        await this._store.dispatch(this._orderActionCreator.submitOrder(order, options));

        const _paymentData = {
            ...paymentData,
            formattedPayload: this._createFormattedPayload(payment.methodId, paymentData),
        };

        try {
            return await this._store.dispatch(this._paymentActionCreator.submitPayment({ ...payment, paymentData: _paymentData }));
        } catch (error) {
            return this._processResponse(error);
        }
    }

    private _createFormattedPayload(methodId: string, paymentData: PaymentInstrument): CheckoutcomFawryInstrument {
        const CHECKOUTCOM_FAWRY_PAYMENT_METHOD = 'fawry';
        const formattedPayload: CheckoutcomFawryInstrument = { customerMobile: '', customerEmail: '' };
        const { customerMobile, customerEmail } = paymentData as CheckoutcomFawryInstrument;

        if (methodId === CHECKOUTCOM_FAWRY_PAYMENT_METHOD && document) {
            formattedPayload.customerMobile = customerMobile;
            formattedPayload.customerEmail = customerEmail;
        }

        return formattedPayload;
    }
}

import {CheckoutStore, CheckoutValidator, InternalCheckoutSelectors} from '../../../checkout';
import {
    InvalidArgumentError,
    MissingDataError,
    MissingDataErrorType,
    NotInitializedError,
    NotInitializedErrorType
} from '../../../common/error/errors';
import { OrderActionCreator, OrderRequestBody } from '../../../order';
import {RemoteCheckoutActionCreator} from '../../../remote-checkout';
import {PaymentArgumentInvalidError} from '../../errors';
import PaymentActionCreator from '../../payment-action-creator';
import PaymentMethod from '../../payment-method';
import PaymentMethodActionCreator from '../../payment-method-action-creator';
import { PaymentInitializeOptions, PaymentRequestOptions } from '../../payment-request-options';
import PaymentStrategy from '../payment-strategy';

import { Zip, ZipInitializeOptions, ZipPayload, ZipScriptLoader } from './';

export default class ZipPaymentStrategy implements PaymentStrategy {
    private _initializeOptions?: ZipInitializeOptions;
    private _paymentMethod?: PaymentMethod;
    private _zipClient?: Zip;

    constructor(
        private _store: CheckoutStore,
        private _checkoutValidator: CheckoutValidator,
        private _orderActionCreator: OrderActionCreator,
        private _paymentActionCreator: PaymentActionCreator,
        private _paymentMethodActionCreator: PaymentMethodActionCreator,
        private _remoteCheckoutActionCreator: RemoteCheckoutActionCreator,
        private _zipScriptLoader: ZipScriptLoader
    ) {}

    initialize(options: PaymentInitializeOptions): Promise<InternalCheckoutSelectors> {
        const { methodId } = options;

        this._paymentMethod = this._store.getState().paymentMethods.getPaymentMethod(methodId);

        if (!this._paymentMethod) {
            throw new MissingDataError(MissingDataErrorType.MissingPaymentMethod);
        }

        return this._zipScriptLoader.load()
            .then(zip => {
                this._zipClient = zip;

                if (!options.zip) {
                    throw new InvalidArgumentError('Unable to initialize payment because "options.zip" argument is not provided.');
                }
                this._initializeOptions = options.zip;

                return this._store.getState();
            });
    }

    deinitialize(options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
        this._paymentMethod = undefined;

        return Promise.resolve(this._store.getState());
    }

    execute(payload: OrderRequestBody, options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
        const paymentId = payload.payment && payload.payment.methodId;

        if (!paymentId) {
            throw new PaymentArgumentInvalidError(['payment.gatewayId']);
        }

        const useStoreCredit = !!payload.useStoreCredit;

        return this._store.dispatch(
            this._remoteCheckoutActionCreator.initializePayment(paymentId, { useStoreCredit })
        )
            .then(state => this._checkoutValidator.validate(state.checkout.getCheckout(), options))
            .then(() => this._store.dispatch(
                this._paymentMethodActionCreator.loadPaymentMethod(paymentId, options)
            ))
            .then(state => this._displayModal(payload, state.paymentMethods.getPaymentMethod(paymentId)))
            // Afterpay will handle the rest of the flow so return a promise that doesn't really resolve
            .then(() => new Promise<never>(() => {}));
    }

    finalize(options: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
        return this._store.dispatch(this._remoteCheckoutActionCreator.loadSettings(options.methodId))
            .then(state => {
                const payment = state.payment.getPaymentId();
                const config = state.config.getContextConfig();
                const afterpay = state.remoteCheckout.getCheckout('afterpay');

                if (!payment) {
                    throw new MissingDataError(MissingDataErrorType.MissingCheckout);
                }

                if (!config || !config.payment.token) {
                    throw new MissingDataError(MissingDataErrorType.MissingCheckoutConfig);
                }

                if (!afterpay || !afterpay.settings) {
                    throw new NotInitializedError(NotInitializedErrorType.PaymentNotInitialized);
                }

                const orderPayload = {
                    useStoreCredit: afterpay.settings.useStoreCredit,
                };

                const paymentPayload = {
                    methodId: payment.providerId,
                    paymentData: { nonce: config.payment.token },
                };

                return this._store.dispatch(this._orderActionCreator.submitOrder(orderPayload, options))
                    .then(() => this._store.dispatch(this._paymentActionCreator.submitPayment(paymentPayload)));
            });
    }
    //
    // private _submitOrder(payload: OrderRequestBody, options?: PaymentRequestOptions) {
    //     const order = { useStoreCredit: payload.useStoreCredit };
    //     if (!this._paymentMethod) {
    //         throw new MissingDataError(MissingDataErrorType.MissingPaymentMethod);
    //     }
    //
    //     const gateway = this._paymentMethod.initializationData.gateway;
    //
    //     const paymentData = this._paymentMethod.initializationData.paymentData;
    //
    //     if (!gateway) {
    //         throw new InvalidArgumentError('Unable to proceed because "paymentMethod.initializationData.gateway" argument is not provided.');
    //     }
    //
    //     if (!paymentData) {
    //         throw new InvalidArgumentError('Unable to proceed because "paymentMethod.initializationData.paymentData" argument is not provided.');
    //     }
    //
    //     return this._store.dispatch(this._orderActionCreator.submitOrder(order, options))
    //         .then(() => this._store.dispatch(this._paymentMethodActionCreator.loadPaymentMethod(gateway)))
    //         .then(() => this._store.dispatch(this._paymentActionCreator.submitPayment({ methodId: gateway, paymentData })));
    // }

    private _displayModal(payload: OrderRequestBody, paymentMethod?: PaymentMethod): void {
        if (!this._initializeOptions) {
            throw new InvalidArgumentError('Unable to initialize payment because "options.zip" argument is not provided.');
        }
        const fakePayload: ZipPayload = {
            checkoutUri: 'http://localhost:3000/api/v1/checkout',
            redirectUri: 'http://localhost:3000/api/v1/return',
            onComplete: this._initializeOptions.onComplete,
            onError: this._initializeOptions.onError,
        };
        if (!this._zipClient || !paymentMethod) {
            throw new NotInitializedError(NotInitializedErrorType.PaymentNotInitialized);
        }

        this._zipClient.Checkout.init(fakePayload);
    }
}

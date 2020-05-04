import { RequestSender } from '@bigcommerce/request-sender';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { CheckoutActionCreator, CheckoutStore, InternalCheckoutSelectors } from '../../../checkout';
import { InvalidArgumentError, MissingDataError, MissingDataErrorType, NotInitializedError, NotInitializedErrorType } from '../../../common/error/errors';
import { bindDecorator as bind } from '../../../common/utility';
import { OrderActionCreator, OrderRequestBody } from '../../../order';
import { OrderFinalizationNotRequiredError } from '../../../order/errors';
import { PaymentMethodCancelledError } from '../../errors';
import Payment from '../../payment';
import PaymentActionCreator from '../../payment-action-creator';
import PaymentMethodActionCreator from '../../payment-method-action-creator';
import { PaymentInitializeOptions, PaymentRequestOptions } from '../../payment-request-options';
import PaymentStrategyActionCreator from '../../payment-strategy-action-creator';
import PaymentStrategy from '../payment-strategy';

import { Boltcheckout } from './bolt';
import BoltScriptLoader from './bolt-script-loader';

export default class BoltPaymentStrategy implements PaymentStrategy {
    private _boltClient?: Boltcheckout;
    private _methodId!: string;

    constructor(
        private _store: CheckoutStore,
        private _checkoutActionCreator: CheckoutActionCreator,
        private _orderActionCreator: OrderActionCreator,
        private _paymentActionCreator: PaymentActionCreator,
        private _paymentMethodActionCreator: PaymentMethodActionCreator,
        private _paymentStrategyActionCreator: PaymentStrategyActionCreator,
        private _requestSender: RequestSender,
        private _boltScriptLoader: BoltScriptLoader,
    ) { }

    async initialize(options: PaymentInitializeOptions): Promise<InternalCheckoutSelectors> {
        this._methodId = options.methodId;

        const state = this._store.getState();
        const paymentMethod = state.paymentMethods.getPaymentMethod(this._methodId);
        const storeConfig = state.config.getStoreConfig();

        if (!paymentMethod) {
            throw new MissingDataError(MissingDataErrorType.MissingPaymentMethod);
        }

        if (!storeConfig) {
            throw new MissingDataError(MissingDataErrorType.MissingCheckoutConfig);
        }

        const boltCheckout = await this._boltScriptLoader.load('dummy', paymentMethod.config.testMode)
        this._boltClient = boltCheckout;

        return Promise.resolve(this._store.getState());
    }

    deinitialize(): Promise<InternalCheckoutSelectors> {
        this._boltClient = undefined;

        return Promise.resolve(this._store.getState());
    }

    async execute(_payload: OrderRequestBody, _options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
        /*const state = await this._store.dispatch(this._paymentMethodActionCreator.loadPaymentMethod(payment.methodId, options));

        const paymentMethod = state.paymentMethods.getPaymentMethod(payment.methodId);

        if (!paymentMethod || !paymentMethod.clientToken) {
            throw new MissingDataError(MissingDataErrorType.MissingPaymentMethod);
        }*/

        const orderToken = 'dummy'; // paymentMethod.clientToken

        return new Promise((resolve, _reject) => {
            const onSuccess = (_transaction: any,  callback: () => void) => {
                callback();
                resolve(this._store.getState());
            };
            const callbacks = {
                success: onSuccess,
            };

            if (!this._boltClient) {
                throw new NotInitializedError(NotInitializedErrorType.PaymentNotInitialized);
            }

            this._boltClient.configure({ orderToken }, callbacks).open();
        });
    }

    finalize(): Promise<InternalCheckoutSelectors> {
        return Promise.reject(new OrderFinalizationNotRequiredError());
    }

    // private _displayWallet(): Promise<InternalCheckoutSelectors> {
    //     return this._store.dispatch(this._paymentStrategyActionCreator.widgetInteraction(() => {
    //         this._store.dispatch(this._paymentMethodActionCreator.loadPaymentMethod(this._methodId))
    //             .then(state => {
    //                 const paymentMethod = state.paymentMethods.getPaymentMethod(this._methodId);

    //                 if (!this._chasePayClient) {
    //                     throw new NotInitializedError(NotInitializedErrorType.PaymentNotInitialized);
    //                 }

    //                 if (!paymentMethod) {
    //                     throw new MissingDataError(MissingDataErrorType.MissingPaymentMethod);
    //                 }

    //                 this._chasePayClient.showLoadingAnimation();
    //                 this._chasePayClient.startCheckout(paymentMethod.initializationData.digitalSessionId);
    //             });

    //         // Wait for payment selection
    //         return new Promise((resolve, reject) => {
    //             this._walletEvent$
    //                 .pipe(take(1))
    //                 .subscribe((event: { type: ChasePayEventType }) => {
    //                     if (event.type === ChasePayEventType.CancelCheckout) {
    //                         reject(new PaymentMethodCancelledError());
    //                     } else if (event.type === ChasePayEventType.CompleteCheckout) {
    //                         resolve();
    //                     }
    //                 });
    //         });
    //     }, { methodId: this._methodId }), { queueId: 'widgetInteraction' });
    // }

    // private _createOrder(payment: Payment, useStoreCredit?: boolean, options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
    //     return this._store.dispatch(this._orderActionCreator.submitOrder({ useStoreCredit }, options))
    //         .then(() => this._store.dispatch(this._paymentActionCreator.submitPayment(payment)));
    // }
}

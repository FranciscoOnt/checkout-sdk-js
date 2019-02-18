import { CheckoutStore, InternalCheckoutSelectors } from '../../../checkout';
import { InvalidArgumentError, MissingDataError, MissingDataErrorType } from '../../../common/error/errors';
import { OrderActionCreator, OrderRequestBody } from '../../../order';
import { OrderFinalizationNotRequiredError } from '../../../order/errors';
import PaymentActionCreator from '../../payment-action-creator';
import PaymentMethod from '../../payment-method';
import PaymentMethodActionCreator from '../../payment-method-action-creator';
import { PaymentInitializeOptions, PaymentRequestOptions } from '../../payment-request-options';
import PaymentStrategy from '../payment-strategy';

import { Zip } from './zip';
import ZipScriptLoader from './zip-script-loader';


export default class ZipPaymentStrategy implements PaymentStrategy {
    private _paymentMethod?: PaymentMethod;
    private _zipClient?: Zip;

    constructor(
        private _store: CheckoutStore,
        private _orderActionCreator: OrderActionCreator,
        private _paymentActionCreator: PaymentActionCreator,
        private _paymentMethodActionCreator: PaymentMethodActionCreator,
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

                if (!options.masterpass) {
                    throw new InvalidArgumentError('Unable to initialize payment because "options.masterpass" argument is not provided.');
                }

                const walletButton  = options.masterpass.walletButton && document.getElementById(options.masterpass.walletButton);

                if (walletButton) {
                    this._walletButton = walletButton;
                    this._walletButton.addEventListener('click', this._handleWalletButtonClick);
                }

                return this._store.getState();
            });
    }

    deinitialize(options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
        this._paymentMethod = undefined;

        return Promise.resolve(this._store.getState());
    }

    execute(payload: OrderRequestBody, options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
        const order = { useStoreCredit: payload.useStoreCredit };

        if (!this._paymentMethod) {
            throw new MissingDataError(MissingDataErrorType.MissingPaymentMethod);
        }

        const gateway = this._paymentMethod.initializationData.gateway;

        const paymentData = this._paymentMethod.initializationData.paymentData;

        if (!gateway) {
            throw new InvalidArgumentError('Unable to proceed because "paymentMethod.initializationData.gateway" argument is not provided.');
        }

        if (!paymentData) {
            throw new InvalidArgumentError('Unable to proceed because "paymentMethod.initializationData.paymentData" argument is not provided.');
        }

        return this._store.dispatch(this._orderActionCreator.submitOrder(order, options))
            .then(() => this._store.dispatch(this._paymentMethodActionCreator.loadPaymentMethod(gateway)))
            .then(() => this._store.dispatch(this._paymentActionCreator.submitPayment({ methodId: gateway, paymentData })));
    }

    finalize(options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
        return Promise.reject(new OrderFinalizationNotRequiredError());
    }
}

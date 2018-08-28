import { CheckoutStore, InternalCheckoutSelectors } from '../../checkout';
import { InvalidArgumentError, MissingDataError, MissingDataErrorType, NotImplementedError, NotInitializedError, NotInitializedErrorType } from '../../common/error/errors';
import { PaymentMethod, PaymentMethodActionCreator } from '../../payment';
import { StripeScriptLoader } from '../../payment/strategies/stripe';
import { RemoteCheckoutActionCreator } from '../../remote-checkout';
import CustomerCredentials from '../customer-credentials';
import {CustomerInitializeOptions, CustomerRequestOptions} from '../customer-request-options';

import CustomerStrategy from './customer-strategy';

export default class StripeCustomerStrategy extends CustomerStrategy {
    private _paymentMethod?: PaymentMethod;

    constructor(
        store: CheckoutStore,
        private _paymentMethodActionCreator: PaymentMethodActionCreator,
        private _remoteCheckoutActionCreator: RemoteCheckoutActionCreator,
        private _stripeScriptLoader: StripeScriptLoader
    ) {
        super(store);
    }

    initialize(options: CustomerInitializeOptions): Promise<InternalCheckoutSelectors> {
        const { stripe: stripeOptions, methodId } = options;

        if (!stripeOptions || !methodId) {
            throw new InvalidArgumentError('Unable to proceed because "options.stripe" argument is not provided.');
        }

        return this._store.dispatch(this._paymentMethodActionCreator.loadPaymentMethod(methodId))
            .then(state => {
                this._paymentMethod = state.paymentMethods.getPaymentMethod(methodId);

                const cart = state.cart.getCart();
                const storeConfig = state.config.getStoreConfig();

                if (!cart) {
                    throw new MissingDataError(MissingDataErrorType.MissingCart);
                }
                if (!storeConfig) {
                    throw new MissingDataError(MissingDataErrorType.MissingCheckoutConfig);
                }
                if (!this._paymentMethod || !this._paymentMethod.initializationData.checkoutId || !this._paymentMethod.initializationData.masterpassEnabled) {
                    throw new NotInitializedError(NotInitializedErrorType.PaymentNotInitialized);
                }
                const container = stripeOptions.container;

                return this._stripeScriptLoader.load(this._paymentMethod.config.testMode)
                    .then(Masterpass => {
                        const signInButton = this._createSignInButton(container);
                        if (!this._paymentMethod) {
                            throw new NotInitializedError(NotInitializedErrorType.PaymentNotInitialized);
                        }
                        const payload = {
                            checkoutId: this._paymentMethod.initializationData.checkoutId,
                            allowedCardTypes: this._paymentMethod.initializationData.allowedCardTypes,
                            amount: String(cart.cartAmount.toFixed(2)),
                            currency: cart.currency.code,
                            cartId: cart.id,
                        };
                        signInButton.addEventListener('click', () => {
                            Masterpass.checkout(payload);
                        });
                    });
            })
            .then(() => super.initialize(options));
    }

    signIn(credentials: CustomerCredentials, options?: CustomerRequestOptions): Promise<InternalCheckoutSelectors> {
        throw new NotImplementedError(
            'In order to sign in via Masterpass, the shopper must click on "Masterpass" button.'
        );
    }

    signOut(options?: any): Promise<InternalCheckoutSelectors> {
        const state = this._store.getState();
        const payment = state.payment.getPaymentId();

        if (!payment) {
            return Promise.resolve(this._store.getState());
        }

        return this._store.dispatch(
            this._remoteCheckoutActionCreator.signOut(payment.providerId, options)
        );
    }

    private _createSignInButton(containerId: string): HTMLElement {
        const container = document.querySelector(`#${containerId}`);

        if (!container) {
            throw new Error('Need a container to place the button');
        }

        return this._insertMasterpassButton(container);
    }

    private _insertMasterpassButton(container: Element): HTMLElement {
        const buttonTemplate = `
            <img
            id="mpbutton"
            style="cursor: pointer;"
            src="https://static.masterpass.com/dyn/img/btn/global/mp_chk_btn_147x034px.svg"
            />`;
        const masterpassButton = document.createElement('div');
        masterpassButton.innerHTML = buttonTemplate;

        container.appendChild(masterpassButton);
        return masterpassButton;
    }
}

export interface StripeCustomerInitializeOptions {
    container: string;
}

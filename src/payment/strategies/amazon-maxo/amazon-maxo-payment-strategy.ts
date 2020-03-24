//import { noop } from 'lodash';

import { CheckoutStore, InternalCheckoutSelectors } from '../../../checkout';
import { InvalidArgumentError, MissingDataError, MissingDataErrorType } from '../../../common/error/errors';
import { OrderRequestBody } from '../../../order';
import { OrderFinalizationNotRequiredError } from '../../../order/errors';
import { AmazonMaxoPaymentProcessor, AmazonMaxoPlacement } from '../../../payment/strategies/amazon-maxo';
// import { RemoteCheckoutActionCreator } from '../../../remote-checkout';
// import PaymentMethod from '../../payment-method';
import PaymentMethodActionCreator from '../../payment-method-action-creator';
import { PaymentInitializeOptions, PaymentRequestOptions } from '../../payment-request-options';
import PaymentStrategyActionCreator from '../../payment-strategy-action-creator';
import PaymentStrategy from '../payment-strategy';

// import { AmazonMaxoHostWindow } from './amazon-maxo';
// import AmazonMaxoScriptLoader from './amazon-maxo-script-loader';

export default class AmazonMaxoPaymentStrategy implements PaymentStrategy {

    private _methodId?: string;
    private _walletButton?: HTMLElement;
    private _signInCustomer?: () => Promise<void>;
    // private _window: AmazonMaxoHostWindow;
    // private _isPaymentMethodSelected: boolean;

    constructor(
        private _store: CheckoutStore,
        private _paymentStrategyActionCreator: PaymentStrategyActionCreator,
        private _paymentMethodActionCreator: PaymentMethodActionCreator,
        // private _remoteCheckoutActionCreator: RemoteCheckoutActionCreator,
        private _amazonMaxoPaymentProcessor: AmazonMaxoPaymentProcessor
    ) { }

    initialize(options: PaymentInitializeOptions): Promise<InternalCheckoutSelectors> {
        const { methodId, amazonmaxo } = options;

        if (!amazonmaxo) {
            throw new InvalidArgumentError('Unable to proceed because "options.amazonmaxo" argument is not provided.');
        }

        if (!methodId) {
            throw new MissingDataError(MissingDataErrorType.MissingPaymentMethod);
        }

        return this._store.dispatch(this._paymentMethodActionCreator.loadPaymentMethod(methodId))
            .then(state => {
                const paymentMethod = state.paymentMethods.getPaymentMethod(methodId);

                if (!paymentMethod) {
                    throw new MissingDataError(MissingDataErrorType.MissingPaymentMethod);
                }

                const { paymentToken } = paymentMethod.initializationData;

                this._methodId = methodId;
                this._signInCustomer = amazonmaxo.signInCustomer;

                // TODO Do not create button if paymentoken is present
                // TODO edit billing and shipping
                return this._amazonMaxoPaymentProcessor.initialize(this._methodId)
                    .then(() => {
                        if (paymentToken) {
                        // edit-shipping-address-button
                            this._bindEditButton(paymentToken);
                        } else {
                            this._walletButton = this._createSignInButton(amazonmaxo.container);

                        }
                    })
                    .then(() => this._store.getState());

                    });
    }

    execute(_payload: OrderRequestBody, _options?: PaymentRequestOptions | undefined): Promise<InternalCheckoutSelectors> {
        const methodId = this._methodId || '';

        // TODO Load payment method and get token form initializationdata
        // TODO Dispatch offsite initialize when token is present
        return this._store.dispatch(this._paymentStrategyActionCreator.widgetInteraction(() => {
            if (this._signInCustomer) {
                return this._signInCustomer();
            }

            return Promise.reject();
        }, { methodId }), { queueId: 'widgetInteraction' });
    }

    finalize(_options?: PaymentRequestOptions | undefined): Promise<InternalCheckoutSelectors> {
        return Promise.reject(new OrderFinalizationNotRequiredError());
    }

    deinitialize(_options?: PaymentRequestOptions | undefined): Promise<InternalCheckoutSelectors> {
        if (this._walletButton && this._walletButton.parentNode) {
            this._walletButton.parentNode.removeChild(this._walletButton);
            this._walletButton = undefined;
        }

        return Promise.resolve(this._store.getState());
    }

    private _bindEditButton(sessionId: string): void {
        const button = document.querySelector('#edit-shipping-address-button');

        if (!button) {
            return;
        }

        const clone = button.cloneNode(true);
        button.replaceWith(clone);

        this._amazonMaxoPaymentProcessor.bindButton('#edit-shipping-address-button', sessionId);
    }

    private _createSignInButton(containerId: string): HTMLElement {
        const container = document.querySelector(`#${containerId}`);

        if (!container) {
            throw new InvalidArgumentError('Unable to create sign-in button without valid container ID.');
        }

        if (!this._methodId) {
            throw new MissingDataError(MissingDataErrorType.MissingPaymentMethod);
        }

        const state = this._store.getState();
        const paymentMethod =  state.paymentMethods.getPaymentMethod(this._methodId);

        const config = state.config.getStoreConfig();

        if (!config) {
            throw new MissingDataError(MissingDataErrorType.MissingCheckoutConfig);
        }

        if (!paymentMethod) {
            throw new MissingDataError(MissingDataErrorType.MissingPaymentMethod);
        }

        const {
            config: {
                merchantId,
                testMode,
            },
            initializationData: {
                checkoutLanguage,
                ledgerCurrency,
                checkoutSessionMethod,
                region,
                extractAmazonCheckoutSessionId,
            },
        } = paymentMethod;

        if (!merchantId) {
            throw new InvalidArgumentError();
        }

        const amazonButtonOptions = {
            merchantId,
            sandbox: !!testMode,
            checkoutLanguage,
            ledgerCurrency,
            region,
            productType: 'PayAndShip',
            createCheckoutSession: {
                method: checkoutSessionMethod,
                url: `${config.links.siteLink}/remote-checkout-token/${this._methodId}`,
                extractAmazonCheckoutSessionId,
            },
            placement: AmazonMaxoPlacement.Checkout,
        };

        return this._amazonMaxoPaymentProcessor.createButton(`#${containerId}`, amazonButtonOptions);
    }
}

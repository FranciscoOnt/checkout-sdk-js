import { CheckoutStore, InternalCheckoutSelectors } from '../../../checkout';
import { InvalidArgumentError, MissingDataError, MissingDataErrorType } from '../../../common/error/errors';
import { OrderRequestBody } from '../../../order';
import { AmazonMaxoPaymentProcessor, AmazonMaxoPlacement } from '../../../payment/strategies/amazon-maxo';
// import { RemoteCheckoutActionCreator } from '../../../remote-checkout';
// import PaymentMethod from '../../payment-method';
import { PaymentInitializeOptions, PaymentRequestOptions } from '../../payment-request-options';
import PaymentStrategyActionCreator from '../../payment-strategy-action-creator';
import PaymentStrategy from '../payment-strategy';

// import { AmazonMaxoHostWindow } from './amazon-maxo';
// import AmazonMaxoScriptLoader from './amazon-maxo-script-loader';

export default class AmazonMaxoPaymentStrategy implements PaymentStrategy {

    private _methodId?: string;
    private _walletButton?: HTMLElement;
    // private _window: AmazonMaxoHostWindow;
    // private _isPaymentMethodSelected: boolean;

    constructor(
        private _store: CheckoutStore,
        private _paymentStrategyActionCreator: PaymentStrategyActionCreator,
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

        if (!amazonmaxo.walletButton) {
            throw new InvalidArgumentError('Unable to initialize payment because "options.amazonmaxo" argument is not provided.');
        }

        this._methodId = methodId;

        return this._amazonMaxoPaymentProcessor.initialize(methodId)
            .then(() => { this._walletButton = this._createSignInButton(amazonmaxo.walletButton);
            })
            .then(() => this._store.getState());
    }

    execute(_payload: OrderRequestBody, _options?: PaymentRequestOptions | undefined): Promise<InternalCheckoutSelectors> {
        const methodId = this._methodId || '';

        return this._store.dispatch(this._paymentStrategyActionCreator.widgetInteraction(() => {
            return Promise.reject();
        }, { methodId }), { queueId: 'widgetInteraction' });
    }

    finalize(options?: PaymentRequestOptions | undefined): Promise<InternalCheckoutSelectors> {
        if (!options) {
            throw new InvalidArgumentError('Unable to initialize payment because "options.amazonmaxo" argument is not provided.');
        }
        throw new Error('Method not implemented.');
    }
    deinitialize(_options?: PaymentRequestOptions | undefined): Promise<InternalCheckoutSelectors> {
        if (this._walletButton && this._walletButton.parentNode) {
            this._walletButton.parentNode.removeChild(this._walletButton);
            this._walletButton = undefined;
        }

        return Promise.resolve(this._store.getState());
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

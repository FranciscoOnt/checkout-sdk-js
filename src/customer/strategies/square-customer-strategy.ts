import { RequestSender, Response } from '@bigcommerce/request-sender';

import {CheckoutActionCreator, CheckoutStore, InternalCheckoutSelectors} from '../../checkout';
import { CustomerStrategyActionCreator } from '..';
import {
    InvalidArgumentError, MissingDataError, MissingDataErrorType, NotImplementedError, NotInitializedError,
    NotInitializedErrorType, StandardError, UnsupportedBrowserError
} from '../../common/error/errors';
import { toFormUrlEncoded } from '../../common/http-request';
import {PaymentMethod, PaymentMethodActionCreator, PaymentStrategyActionCreator} from '../../payment';
import { SquareScriptLoader } from '../../payment/strategies/square';
import { RemoteCheckoutActionCreator } from '../../remote-checkout';
import CustomerCredentials from '../customer-credentials';
import {CustomerInitializeOptions, CustomerRequestOptions} from '../customer-request-options';

import CustomerStrategy from './customer-strategy';
import SquarePaymentForm, {
    CardData, Contact, DigitalWalletType, NonceGenerationError, SquareFormElement, SquareFormOptions,
    SquareValidationErrors
} from "../../payment/strategies/square/square-form";
import {DeferredPromise} from "../../payment/strategies/square/square-payment-strategy";
import {FormPoster} from "@bigcommerce/form-poster";

export default class SquareCustomerStrategy extends CustomerStrategy {
    private _paymentForm?: SquarePaymentForm;
    private _deferredRequestNonce?: DeferredPromise;
    private _paymentMethod?: PaymentMethod;
    private _buttonId: string = 'sq-masterpass';
    private _formElementClass: string = 'form-input';
    private fakeContact: Contact = {
        familyName: 'FAKE',
        givenName: 'FAKE',
        email: 'example@fake.com',
        country: 'US',
        countryName: 'United States',
        region: 'TX',
        city: 'Austin',
        addressLines: ['addres 1', 'address2'],
        postalCode: '12345',
    };

    constructor(
        store: CheckoutStore,
        private _checkoutActionCreator: CheckoutActionCreator,
        private _paymentMethodActionCreator: PaymentMethodActionCreator,
        private _customerStrategyActionCreator: CustomerStrategyActionCreator,
        private _remoteCheckoutActionCreator: RemoteCheckoutActionCreator,
        private _squareScriptLoader: SquareScriptLoader,
        private _requestSender: RequestSender,
        private _formPoster: FormPoster
    ) {
        super(store);
    }

    initialize(options: CustomerInitializeOptions): Promise<InternalCheckoutSelectors> {
        const { squarev2: squareOptions, methodId } = options;
        console.log('square', squareOptions);
        if (!squareOptions || !methodId) {
            throw new InvalidArgumentError('Unable to proceed because "options.squarev2" argument is not provided.');
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
                if (!this._paymentMethod || !this._paymentMethod.initializationData.enableMasterpass) {
                    throw new NotInitializedError(NotInitializedErrorType.PaymentNotInitialized);
                }

                if (squareOptions.container === undefined)
                {
                    throw new InvalidArgumentError('Unable to proceed because "squarev2.container" argument is not provided.');
                }
                const container = squareOptions.container;
                const options2 = {
                    methodId,
                    squarev2: {
                        masterpass: {
                            elementId: squareOptions.container,
                        },
                        cardNumber: {
                            elementId: 'none1',
                        },
                        cvv: {
                            elementId: 'none2',
                        },
                        expirationDate: {
                            elementId: 'none3',
                        },
                        postalCode: {
                            elementId: 'none4',
                        },
                        inputClass: this._formElementClass,
                    } as SquareCustomerInitializeOptions,
                } as CustomerInitializeOptions;
                return this._squareScriptLoader.load()
                    .then(createSquareForm =>
                        new Promise((resolve, reject) => {
                            const signInButton = this._createSignInButton(container);
                            this._paymentForm = createSquareForm(
                                this._getFormOptions(options2, {resolve, reject})
                            );
                            this._paymentForm.build();
                        })
                    );
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

    private _getFormOptions(options: CustomerInitializeOptions, deferred: DeferredPromise): SquareFormOptions {
        const { squarev2: squareOptions, methodId } = options;
        const state = this._store.getState();
        if (methodId === undefined) {
            throw new InvalidArgumentError('Unable to proceed because "methodID" argument is not provided.');
        }
        const paymentMethod = state.paymentMethods.getPaymentMethod(methodId);

        if (!squareOptions || !paymentMethod) {
            throw new InvalidArgumentError('Unable to proceed because "options.square" argument is not provided.');
        }
        return {
            ...squareOptions,
            ...paymentMethod.initializationData,
            callbacks: {
                paymentFormLoaded: () => {
                    console.log('form loaded');
                    deferred.resolve();
                    const state = this._store.getState();
                    if (!this._paymentForm) {
                        throw new NotInitializedError(NotInitializedErrorType.PaymentNotInitialized);
                    }
                },
                unsupportedBrowserDetected: () => {
                    deferred.reject(new UnsupportedBrowserError());
                },
                cardNonceResponseReceived: (errors: NonceGenerationError[] | undefined, nonce: string | undefined, cardData: CardData | undefined,
                                            billingContact: Contact | undefined, shippingContact: Contact | undefined) => {
                    try {
                        console.log('bill', billingContact);
                        console.log('ship', shippingContact);
                        if (errors) {
                            this._handleNonceGenerationErrors(errors);
                        }
                        if (nonce) {
                            if (cardData && cardData.digital_wallet_type !== DigitalWalletType.none) {
                                this._setExternalCheckoutData(cardData, nonce, billingContact, shippingContact)
                                    .then(() => {
                                        this._paymentInstrumentSelected(methodId)
                                            .then(() => {
                                                this._reloadPage();
                                            });
                                    });
                            } else {
                                this._cardNonceResponseReceived(nonce, errors);
                            }
                        }
                    }
                    catch (e)
                    {
                        console.log(e);
                    }
                },
                methodsSupported: () => {},

                /*
                 * callback function: createPaymentRequest
                 * Triggered when: a digital wallet payment button is clicked.
                */
                createPaymentRequest: () => {
                    const state = this._store.getState();
                    const checkout = state.checkout.getCheckout();
                    const storeConfig = state.config.getStoreConfig();

                    if (!checkout) {
                        throw new MissingDataError(MissingDataErrorType.MissingCheckout);
                    }

                    if (!storeConfig) {
                        throw new MissingDataError(MissingDataErrorType.MissingCheckoutConfig);
                    }

                    return {
                        requestShippingAddress: true,
                        requestBillingInfo: true,
                        currencyCode: storeConfig.currency.code,
                        countryCode: 'US',
                        total: {
                            label: storeConfig.storeProfile.storeName,
                            amount: checkout.subtotal.toString(),
                            pending: false,
                        },
                    };
                },

                validateShippingContact: (errors: SquareValidationErrors) => {
                    if (errors) {
                        this._handleSquareValidationErrors(errors);
                    }
                },
            },
        };
    }

    private _paymentInstrumentSelected(methodId: string) {
        console.log('intrument', methodId);
        return this._store.dispatch(this._customerStrategyActionCreator.widgetInteraction(() => {
                return Promise.all([
                    this._store.dispatch(this._checkoutActionCreator.loadCurrentCheckout()),
                    this._store.dispatch(this._paymentMethodActionCreator.loadPaymentMethod(methodId)),
                ]);
            }, {methodId}), {queueId: 'widgetInteraction'});
    }

    private _handleNonceGenerationErrors(errors: NonceGenerationError[]) {
        const error = errors[0];

        throw new StandardError(error.message);
    }

    private _handleSquareValidationErrors(error: SquareValidationErrors) {
        if (error.country) {
            throw new StandardError(error.country.join(','));
        }
        if (error.region) {
            throw new StandardError(error.region.join(','));
        }
        if (error.city) {
            throw new StandardError(error.city.join(','));
        }
        if (error.addressLines) {
            throw new StandardError(error.addressLines.join(','));
        }

        if (error.postalCode) {
            throw new StandardError(error.postalCode.join(','));
        }

        throw new StandardError('Unknown error');

    }

    private _cardNonceResponseReceived(nonce: string, nonceGenerationErrors: NonceGenerationError[] | undefined): void {
        if (!this._deferredRequestNonce) {
            throw new StandardError();
        }

        if (nonceGenerationErrors) {
            this._deferredRequestNonce.reject(nonceGenerationErrors);
        } else {
            this._deferredRequestNonce.resolve({ nonce });
        }
    }

    private _setExternalCheckoutData(cardData: CardData, nonce: string, billingContact: Contact | undefined, shippingContact: Contact | undefined): Promise<Response> {
        return this._requestSender.post('/checkout.php', {
            headers: {
                Accept: 'text/html',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: toFormUrlEncoded({
                nonce,
                provider: 'squarev2',
                action: 'set_external_checkout',
                cardData: JSON.stringify(cardData),
                billingContact: JSON.stringify(this.fakeContact),
                shippingContact: JSON.stringify(this.fakeContact),
            }),
        });
    }

    private _reloadPage() {
        this._formPoster.postForm('checkout.php?action=confirm_order', {
            headers: {
                Accept: 'text/html',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    }

    private _createSignInButton(containerId: string): HTMLElement {
        const container = document.querySelector(`#${containerId}`);

        if (!container) {
            throw new Error('Need a container to place the button');
        }

        return this._insertMasterpassPlaceholders(container);
    }

    private _insertMasterpassPlaceholders(container: Element): HTMLElement {
        const buttonTemplate = `
            <input type="button" alt="Masterpass" class="button-masterpass" role="button" id ="${this._buttonId}" />
            <div style="visibility: hidden; display: none">
                <input hidden type="text" id ="none1" style="visibility: hidden"/>
                <input hidden type="text" id ="none2" style="visibility: hidden"/>
                <input hidden type="text" id ="none3" style="visibility: hidden"/>
                <input hidden type="text" id ="none4" style="visibility: hidden"/>
            </div>
             `;

        const masterpassButton = document.createElement('div');
        masterpassButton.innerHTML = buttonTemplate;

        container.appendChild(masterpassButton);
        return masterpassButton;
    }
}

export interface SquareCustomerInitializeOptions {
    container?: string;
    /**
     * The location to insert the Masterpass Button.
     */
    masterpass?: SquareFormElement;

    /**
     * A callback that gets called when the customer selects a payment option.
     */
    onPaymentSelect?(): void;
}

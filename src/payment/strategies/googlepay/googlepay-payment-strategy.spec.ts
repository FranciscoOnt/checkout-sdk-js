import { createAction, Action } from '@bigcommerce/data-store';
import { createRequestSender, RequestSender } from '@bigcommerce/request-sender';
import { createScriptLoader, ScriptLoader } from '@bigcommerce/script-loader';
import { Observable } from 'rxjs';

import { BillingAddressActionCreator, BillingAddressRequestSender } from '../../../billing';
import { getCartState } from '../../../cart/carts.mock';
import {
    createCheckoutStore,
    CheckoutActionCreator,
    CheckoutRequestSender,
    CheckoutStore,
    CheckoutValidator
} from '../../../checkout';
import { getCheckoutState } from '../../../checkout/checkouts.mock';
import InvalidArgumentError from '../../../common/error/errors/invalid-argument-error';
import MissingDataError from '../../../common/error/errors/missing-data-error';
import { ConfigActionCreator, ConfigRequestSender } from '../../../config';
import { getConfigState } from '../../../config/configs.mock';
import { getCustomerState } from '../../../customer/customers.mock';
import { OrderActionCreator, OrderActionType, OrderRequestBody } from '../../../order';
import { getOrderRequestBody } from '../../../order/internal-orders.mock';
import {
    createPaymentClient,
    createPaymentStrategyRegistry,
    PaymentActionCreator,
    PaymentMethod,
    PaymentMethodActionCreator
} from '../../../payment';
import { getGooglePay, getPaymentMethodsState } from '../../../payment/payment-methods.mock';
import { GooglePayScriptLoader, GooglePaySDK } from '../../../payment/strategies/googlepay';
import {
    getGooglePaymentDataDequestV1Mock,
    getGooglePaymentDataMock,
    getGooglePaySDKMock,
    getTokenizedPayload
} from '../../../payment/strategies/googlepay/googlepay.mock';
import ConsignmentActionCreator from '../../../shipping/consignment-action-creator';
import ConsignmentRequestSender from '../../../shipping/consignment-request-sender';
import { PaymentActionType } from '../../payment-actions';
import PaymentMethodRequestSender from '../../payment-method-request-sender';
import { PaymentInitializeOptions } from '../../payment-request-options';
import PaymentRequestSender from '../../payment-request-sender';
import PaymentStrategyActionCreator from '../../payment-strategy-action-creator';
import BraintreeScriptLoader from '../braintree/braintree-script-loader';
import BraintreeSDKCreator from '../braintree/braintree-sdk-creator';
import PaymentStrategy from '../payment-strategy';

import GooglePayBraintreeInitializer from './googlepay-braintree-initializer';
import GooglePayPaymentStrategy from './googlepay-payment-strategy';

describe('ChasePayPaymentStrategy', () => {
    let container: HTMLDivElement;
    let walletButton: HTMLAnchorElement;
    let checkoutActionCreator: CheckoutActionCreator;
    let paymentMethodActionCreator: PaymentMethodActionCreator;
    let paymentStrategyActionCreator: PaymentStrategyActionCreator;
    let paymentActionCreator: PaymentActionCreator;
    let paymentMethodMock: PaymentMethod;
    let orderActionCreator: OrderActionCreator;
    let store: CheckoutStore;
    let strategy: PaymentStrategy;
    let googlePayScriptLoader: GooglePayScriptLoader;
    let googlePaySDK: GooglePaySDK;
    let requestSender: RequestSender;
    let scriptLoader: ScriptLoader;
    let googlePayBraintreeInitializer: GooglePayBraintreeInitializer;
    let billingAddressActionCreator: BillingAddressActionCreator;
    let consignmentActionCreator: ConsignmentActionCreator;
    let braintreeSdkCreator: BraintreeSDKCreator;
    let braintreeScriptLoader: BraintreeScriptLoader;
    let consignmentRequestSender: ConsignmentRequestSender;

    beforeEach(() => {
        paymentMethodMock = { ...getGooglePay() };
        scriptLoader = createScriptLoader();

        store = createCheckoutStore({
            checkout: getCheckoutState(),
            customer: getCustomerState(),
            config: getConfigState(),
            cart: getCartState(),
            paymentMethods: getPaymentMethodsState(),
        });

        jest.spyOn(store, 'dispatch')
            .mockReturnValue(Promise.resolve(store.getState()));

        jest.spyOn(store.getState().paymentMethods, 'getPaymentMethod')
            .mockReturnValue(paymentMethodMock);

        jest.spyOn(store, 'getState');

        const googlePayIsReadyToPayResponse = {
            result: true,
        };
        const googlePaymentDataMock = getGooglePaymentDataMock();
        googlePaySDK = getGooglePaySDKMock();
        const clientMock = {
            isReadyToPay: jest.fn(() => Promise.resolve(googlePayIsReadyToPayResponse)),
            loadPaymentData: jest.fn((a: any) => Promise.resolve(googlePaymentDataMock)),
            createButton: jest.fn(() => Promise.resolve(new HTMLElement())),
        };
        googlePaySDK.payments.api.PaymentsClient = jest.fn(() => clientMock);

        googlePayScriptLoader = new GooglePayScriptLoader(createScriptLoader());

        jest.spyOn(googlePayScriptLoader, 'load')
            .mockReturnValue(Promise.resolve(googlePaySDK));
        // jest.spyOn(googlePaySDK.ChasePay, 'isChasePayUp')
        //     .mockReturnValue(true);

        requestSender = createRequestSender();

        const paymentClient = createPaymentClient(store);
        const checkoutRequestSender = new CheckoutRequestSender(createRequestSender());
        const configRequestSender = new ConfigRequestSender(createRequestSender());
        const configActionCreator = new ConfigActionCreator(configRequestSender);
        const registry = createPaymentStrategyRegistry(store, paymentClient, requestSender);
        const _requestSender: PaymentMethodRequestSender = new PaymentMethodRequestSender(requestSender);

        paymentMethodActionCreator = new PaymentMethodActionCreator(_requestSender);
        orderActionCreator = new OrderActionCreator(paymentClient, new CheckoutValidator(new CheckoutRequestSender(createRequestSender())));
        paymentActionCreator = new PaymentActionCreator(new PaymentRequestSender(paymentClient), orderActionCreator);
        checkoutActionCreator = new CheckoutActionCreator(checkoutRequestSender, configActionCreator);
        paymentStrategyActionCreator = new PaymentStrategyActionCreator(registry, orderActionCreator);
        braintreeScriptLoader = new BraintreeScriptLoader(scriptLoader);
        braintreeSdkCreator = new BraintreeSDKCreator(braintreeScriptLoader);
        consignmentRequestSender = new ConsignmentRequestSender(requestSender);
        consignmentActionCreator = new ConsignmentActionCreator(consignmentRequestSender, checkoutRequestSender);
        googlePayBraintreeInitializer = new GooglePayBraintreeInitializer(braintreeSdkCreator);
        billingAddressActionCreator = new BillingAddressActionCreator(new BillingAddressRequestSender(requestSender));
        googlePayBraintreeInitializer.parseResponse = jest.fn(() => Promise.resolve(getTokenizedPayload()));
        consignmentActionCreator.updateAddress = jest.fn(() => Promise.resolve());
        checkoutActionCreator.loadCurrentCheckout = jest.fn(() => Promise.resolve());
        paymentMethodActionCreator.loadPaymentMethod = jest.fn(() => Promise.resolve());
        // jest.spyOn(paymentStrategyActionCreator, 'widgetInteraction')
        //     .mockImplementation(cb => cb() );
        requestSender.post = jest.fn(() => Promise);

        strategy = new GooglePayPaymentStrategy(
            store,
            checkoutActionCreator,
            paymentMethodActionCreator,
            paymentStrategyActionCreator,
            paymentActionCreator,
            orderActionCreator,
            googlePayScriptLoader,
            googlePayBraintreeInitializer,
            requestSender,
            billingAddressActionCreator,
            consignmentActionCreator
        );

        container = document.createElement('div');
        walletButton = document.createElement('a');
        container.setAttribute('id', 'login');
        walletButton.setAttribute('id', 'mockButton');
        document.body.appendChild(container);
        document.body.appendChild(walletButton);

        jest.spyOn(walletButton, 'addEventListener');
        jest.spyOn(walletButton, 'removeEventListener');
        jest.spyOn(requestSender, 'post')
            .mockReturnValue(checkoutActionCreator);
        jest.spyOn(googlePayBraintreeInitializer, 'initialize')
            .mockReturnValue(getGooglePaymentDataDequestV1Mock());
        jest.spyOn(checkoutActionCreator, 'loadCurrentCheckout');
        jest.spyOn(paymentMethodActionCreator, 'loadPaymentMethod');
        jest.spyOn(document, 'getElementById');
    });

    afterEach(() => {
        document.body.removeChild(container);
        document.body.removeChild(walletButton);
    });

    it('creates an instance of ChasePayPaymentStrategy', () => {
        expect(strategy).toBeInstanceOf(GooglePayPaymentStrategy);
    });

    describe('#initialize()', () => {
        let googlePayOptions: PaymentInitializeOptions;

        beforeEach(() => {
            googlePayOptions = { methodId: 'googlepay', googlepay: { walletButton: 'mockButton' } };
        });

        it('loads googlepay script', async () => {
            paymentMethodMock.config.testMode = true;

            await strategy.initialize(googlePayOptions);

            expect(googlePayScriptLoader.load).toHaveBeenCalled();
        });

        it('does not load googlepay if initialization options are not provided', async () => {
            googlePayOptions = { methodId: 'googlepay'};
            expect(() => strategy.initialize(googlePayOptions)).toThrowError(InvalidArgumentError);
            expect(googlePayScriptLoader.load).not.toHaveBeenCalled();
        });

        it('does not load googlepay if initialization data is not provided', async () => {
            jest.spyOn(store.getState().paymentMethods, 'getPaymentMethod')
                .mockReturnValue(undefined);
            try {
                await strategy.initialize(googlePayOptions);
            } catch (error) {
                expect(error).toBeInstanceOf(MissingDataError);
                expect(googlePayScriptLoader.load).not.toHaveBeenCalled();

            }
        });

        it('does not load googlepay if store config is not provided', async () => {
            jest.spyOn(store.getState().config, 'getStoreConfig')
                .mockReturnValue(undefined);
            try {
                await strategy.initialize(googlePayOptions);
            } catch (error) {
                expect(error).toBeInstanceOf(MissingDataError);
                expect(googlePayScriptLoader.load).not.toHaveBeenCalled();

            }
        });

        it('adds the event listener to the wallet button', async () => {
            await strategy.initialize(googlePayOptions);

            expect(walletButton.addEventListener).toHaveBeenCalled();
        });

        it('configure googlepay lightbox', async () => {
            jest.spyOn(store.getState().paymentMethods, 'getPaymentMethod')
                .mockReturnValue(undefined);
            try {
                await strategy.initialize(googlePayOptions);
            } catch (error) {

                expect(error).toBeInstanceOf(Error);
            }

        });

        it('check if element exist in the DOM', async () => {
            if (googlePayOptions.googlepay) {
                await strategy.initialize(googlePayOptions);

                expect(document.getElementById).toHaveBeenCalledWith(googlePayOptions.googlepay.walletButton);
            }

        });

        it('triggers widget interaction when wallet button is clicked', async () => {
            if (googlePayOptions.googlepay) {
                await strategy.initialize(googlePayOptions);

                const googlepayButton = document.getElementById(googlePayOptions.googlepay.walletButton || '');

                if (googlepayButton) {
                    await googlepayButton.click();
                }

                expect(store.dispatch).toBeCalled();
            }
        });
    });

    // describe('#execute()', () => {
    //     let googlePayOptions: PaymentInitializeOptions;
    //     let orderRequestBody: OrderRequestBody;
    //     let submitOrderAction: Observable<Action>;
    //     let submitPaymentAction: Observable<Action>;
    //
    //     beforeEach(async () => {
    //         orderRequestBody = getOrderRequestBody();
    //         submitOrderAction = Observable.of(createAction(OrderActionType.SubmitOrderRequested));
    //         submitPaymentAction = Observable.of(createAction(PaymentActionType.SubmitPaymentRequested));
    //         googlePayOptions = { methodId: 'googlepay', googlepay: { logoContainer: 'login', walletButton: 'mockButton' } };
    //         paymentMethodMock.initializationData = {
    //             paymentCryptogram: '11111111111111',
    //             eci: '11111111111',
    //             reqTokenId: '111111111',
    //             expDate: '11/11',
    //             accountNum: '1111',
    //             accountMask: '1111',
    //             transactionId: 'MTExMTExMTEx',
    //         };
    //
    //         paymentActionCreator.submitPayment = jest.fn(() => submitPaymentAction);
    //         orderActionCreator.submitOrder = jest.fn(() => submitOrderAction);
    //         await strategy.initialize(googlePayOptions);
    //     });
    //
    //     it('calls submit order with the order request information', async () => {
    //         await strategy.execute(orderRequestBody, googlePayOptions);
    //         const { payment, ...order } = orderRequestBody;
    //
    //         expect(orderActionCreator.submitOrder).toHaveBeenCalledWith(order, expect.any(Object));
    //         expect(store.dispatch).toHaveBeenCalledWith(submitOrderAction);
    //     });
    //
    //     it('calls submit payment with the payment information', async () => {
    //         await strategy.execute(orderRequestBody, googlePayOptions);
    //
    //         expect(store.dispatch).toHaveBeenCalled();
    //     });
    //
    //     it('calls payment method actioncreator and loads the payment method', async () => {
    //         await strategy.execute(orderRequestBody, googlePayOptions);
    //
    //         expect(paymentMethodActionCreator.loadPaymentMethod).toHaveBeenCalledWith(googlePayOptions.methodId);
    //     });
    //
    //     it('returns the payment information', async () => {
    //         await strategy.execute(orderRequestBody, googlePayOptions);
    //
    //         expect(store.getState).toHaveBeenCalled();
    //     });
    //
    //     it('does not execute the payment if initialization data is not provided', async () => {
    //         paymentMethodMock.initializationData = {};
    //         try {
    //             await strategy.execute(orderRequestBody, googlePayOptions);
    //         } catch (error) {
    //             expect(error).toBeInstanceOf(Error);
    //         }
    //     });
    //
    //     it('pass the options to submitOrder', async () => {
    //         await strategy.execute(orderRequestBody, googlePayOptions);
    //
    //         expect(orderActionCreator.submitOrder).toHaveBeenCalledWith(expect.any(Object), googlePayOptions);
    //     });
    //
    //     it('expect to get the payment method', async () => {
    //         await strategy.execute(orderRequestBody, googlePayOptions);
    //
    //         expect(store.getState().paymentMethods.getPaymentMethod).toHaveBeenCalledWith(googlePayOptions.methodId);
    //     });
    // });

    describe('#deinitialize()', () => {
        let chasePayOptions: PaymentInitializeOptions;
        let submitOrderAction: Observable<Action>;

        beforeEach(async () => {
            chasePayOptions = { methodId: 'googlepay', googlepay: { logoContainer: 'login', walletButton: 'mockButton' } };
            submitOrderAction = Observable.of(createAction(OrderActionType.SubmitOrderRequested));
            orderActionCreator.submitOrder = jest.fn(() => submitOrderAction);

            await strategy.initialize(chasePayOptions);
        });

        it('deinitializes wallet button', async () => {
            if (chasePayOptions.googlepay) {
                await strategy.deinitialize();

                expect(walletButton.removeEventListener).toHaveBeenCalled();
            }
        });

        it('expect to not call the orderActionCreator', async () => {
            await strategy.deinitialize(chasePayOptions);

            expect(orderActionCreator.submitOrder).not.toHaveBeenCalled();
        });

        it('deinitializes strategy', async () => {
            await strategy.deinitialize();
            expect(await strategy.deinitialize()).toEqual(store.getState());
        });

    });

});

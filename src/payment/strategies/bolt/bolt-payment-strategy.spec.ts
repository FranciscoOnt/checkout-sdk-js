import { createClient as createPaymentClient } from '@bigcommerce/bigpay-client';
import { createAction, Action } from '@bigcommerce/data-store';
import { createRequestSender, RequestSender } from '@bigcommerce/request-sender';
import { createScriptLoader, ScriptLoader } from '@bigcommerce/script-loader';
import { of, Observable } from 'rxjs';

import { createCheckoutStore, CheckoutRequestSender, CheckoutStore, CheckoutValidator } from '../../../checkout';
import { getCheckoutStoreState } from '../../../checkout/checkouts.mock';
import { InvalidArgumentError, MissingDataError } from '../../../common/error/errors';
import { OrderActionCreator, OrderActionType, OrderRequestBody, OrderRequestSender, SubmitOrderAction } from '../../../order';
import { OrderFinalizationNotRequiredError } from '../../../order/errors';
import { getOrderRequestBody } from '../../../order/internal-orders.mock';
import { PaymentActionCreator, PaymentMethodActionCreator, PaymentMethod, PaymentMethodActionType } from '../../../payment';
import { getBolt, getPaymentMethodsState } from '../../../payment/payment-methods.mock';
import { BoltScriptLoader, BoltCheckout, BoltClient } from '../../../payment/strategies/bolt';
import { PaymentActionType, SubmitPaymentAction } from '../../payment-actions';
import PaymentMethodRequestSender from '../../payment-method-request-sender';
import { PaymentInitializeOptions, PaymentRequestOptions } from '../../payment-request-options';
import PaymentRequestSender from '../../payment-request-sender';
import PaymentRequestTransformer from '../../payment-request-transformer';

import { getBoltScriptMock, getConfiguredBoltMock } from './bolt.mock';
import BoltPaymentStrategy from './bolt-payment-strategy';

describe('BoltPaymentStrategy', () => {
    let orderActionCreator: OrderActionCreator;
    let paymentRequestTransformer: PaymentRequestTransformer;
    let paymentRequestSender: PaymentRequestSender;
    let paymentActionCreator: PaymentActionCreator;
    let paymentMethodActionCreator: PaymentMethodActionCreator;
    let options: PaymentRequestOptions;
    let payload: OrderRequestBody;
    let store: CheckoutStore;
    let strategy: BoltPaymentStrategy;
    let submitOrderAction: Observable<SubmitOrderAction>;
    let submitPaymentAction: Observable<SubmitPaymentAction>;
    let requestSender: RequestSender;
    let paymentMethodRequestSender: PaymentMethodRequestSender;
    let boltScriptLoader: BoltScriptLoader;
    let boltCheckout: BoltCheckout;
    let boltClient: BoltClient;
    let paymentMethodMock: PaymentMethod;

    beforeEach(() => {
        paymentMethodMock = getBolt();
        requestSender = createRequestSender();
        store = createCheckoutStore(getCheckoutStoreState());
        orderActionCreator = new OrderActionCreator(
            new OrderRequestSender(requestSender),
            new CheckoutValidator(new CheckoutRequestSender(requestSender))
        );
        paymentRequestTransformer = new PaymentRequestTransformer();
        paymentRequestSender = new PaymentRequestSender(createPaymentClient());
        paymentActionCreator = new PaymentActionCreator(
            paymentRequestSender,
            orderActionCreator,
            paymentRequestTransformer
        );
        paymentMethodRequestSender = new PaymentMethodRequestSender(requestSender);
        paymentMethodActionCreator = new PaymentMethodActionCreator(paymentMethodRequestSender);
        submitOrderAction = of(createAction(OrderActionType.SubmitOrderRequested));
        submitPaymentAction = of(createAction(PaymentActionType.SubmitPaymentRequested));

        payload = {
            payment: {
                methodId: 'foobar',
                paymentData: {
                    nonce: 'fooNonce',
                },
            },
        };
        options = { methodId: 'foobar' };

        boltScriptLoader = new BoltScriptLoader(createScriptLoader());
        boltCheckout = getBoltScriptMock();
        boltClient = getConfiguredBoltMock();

        jest.spyOn(boltScriptLoader, 'load')
            .mockReturnValue(Promise.resolve(boltCheckout));
        jest.spyOn(boltCheckout, 'configure')
            .mockReturnValue(Promise.resolve(boltClient));

        jest.spyOn(store, 'dispatch');

        jest.spyOn(orderActionCreator, 'submitOrder')
            .mockReturnValue(submitOrderAction);

        jest.spyOn(paymentActionCreator, 'submitPayment')
            .mockReturnValue(submitPaymentAction);

        jest.spyOn(paymentMethodActionCreator, 'loadPaymentMethod')
            .mockResolvedValue(store.getState());
        jest.spyOn(store.getState().paymentMethods, 'getPaymentMethod')
            .mockReturnValue(paymentMethodMock);

        strategy = new BoltPaymentStrategy(
            store,
            orderActionCreator,
            paymentActionCreator,
            paymentMethodActionCreator,
            boltScriptLoader
        );
    });

    describe('#initialize()', () => {
        let initializeOptions: PaymentInitializeOptions;
        const publishableKey = 'publishableKey';

        beforeEach(() => {
            initializeOptions = { methodId: 'bolt' };
        });

        it('loads bolt script in test mode if test mode is enabled', async () => {
            paymentMethodMock.config.testMode = true;

            await strategy.initialize(initializeOptions);

            expect(boltScriptLoader.load).toHaveBeenLastCalledWith(publishableKey, true);
        });

        it('loads bolt script without test mode if test mode is disabled', async () => {
            paymentMethodMock.config.testMode = false;

            await strategy.initialize(initializeOptions);

            expect(boltScriptLoader.load).toHaveBeenLastCalledWith(publishableKey, false);
        });

        it('fails to load if no publishable key is provided', async () => {
            paymentMethodMock.initializationData.publishableKey = undefined;

            expect(strategy.initialize(initializeOptions)).rejects.toThrow(MissingDataError);
        });
    });

    describe('#deinitialize()', () => {
        let initializeOptions: PaymentInitializeOptions;

        beforeEach(async () => {
            initializeOptions = { methodId: 'bolt' };

            await strategy.initialize(initializeOptions);
        });

        it('deinitializes strategy', async () => {
            await strategy.deinitialize();
            expect(await strategy.deinitialize()).toEqual(store.getState());
        });
    });

    describe('#execute()', () => {
        let initializeOptions: PaymentInitializeOptions;
        let orderRequestBody: OrderRequestBody;
        let submitOrderAction: Observable<Action>;
        let submitPaymentAction: Observable<Action>;

        beforeEach(async () => {
            initializeOptions = { methodId: 'bolt' };
            orderRequestBody = getOrderRequestBody();
            submitOrderAction = of(createAction(OrderActionType.SubmitOrderRequested));
            submitPaymentAction = of(createAction(PaymentActionType.SubmitPaymentRequested));

            await strategy.initialize(initializeOptions);
        });

        it('executers the strategy succesfully', async () => {
            await strategy.execute(orderRequestBody, initializeOptions);
            expect(true).toBe(true);
        });
    });

    describe('#finalize()', () => {
        it('throws error to inform that order finalization is not required', async () => {
            expect(strategy.finalize()).rejects.toThrow(OrderFinalizationNotRequiredError);
        });
    });

    // it('returns checkout state when initializing the strategy', async () => {
    //     return expect(strategy.initialize()).resolves.toEqual(store.getState());
    // });

    // it('returns checkout state when deinitializing the strategy', async () => {
    //     return expect(strategy.deinitialize()).resolves.toEqual(store.getState());
    // });

    // it('does not finalize the strategy as it is not required', async () => {
    //     await expect(strategy.finalize()).rejects.toThrow(OrderFinalizationNotRequiredError);
    // });

    // it('executes the strategy successfully', async () => {
    //     const expectedPayload = {
    //         methodId: 'foobar',
    //         paymentData: {
    //             nonce: 'fooNonce',
    //         },
    //     };
    //     await strategy.execute(payload, options);
    //     expect(store.dispatch).toHaveBeenCalledWith(submitOrderAction);
    //     expect(store.dispatch).toHaveBeenCalledWith(submitPaymentAction);
    //     expect(paymentActionCreator.submitPayment).toHaveBeenCalledWith(expectedPayload);
    // });

    // it('fails to execute the strategy if no payment is provided', async () => {
    //     payload.payment = undefined;

    //     await expect(strategy.execute(payload, options)).rejects.toThrow(InvalidArgumentError);
    // });

    // it('fails to execute the strategy if no method id is provided', async () => {
    //     payload.payment = {
    //         methodId: '',
    //     };

    //     await expect(strategy.execute(payload, options)).rejects.toThrow(MissingDataError);
    // });

    // it('fails to execute the strategy if no nonce is provided', async () => {
    //     payload.payment = {
    //         methodId: 'foobar',
    //         paymentData: { },
    //     };

    //     await expect(strategy.execute(payload, options)).rejects.toThrow(MissingDataError);
    // });
});

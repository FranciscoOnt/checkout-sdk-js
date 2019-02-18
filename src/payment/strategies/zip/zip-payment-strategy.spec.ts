import { createAction, Action } from '@bigcommerce/data-store';
import { createRequestSender, RequestSender } from '@bigcommerce/request-sender';
import { createScriptLoader, ScriptLoader } from '@bigcommerce/script-loader';
import { of, Observable } from 'rxjs';

import { getCartState } from '../../../cart/carts.mock';
import { createCheckoutStore, CheckoutRequestSender, CheckoutStore, CheckoutValidator } from '../../../checkout';
import { getCheckoutState } from '../../../checkout/checkouts.mock';
import MissingDataError from '../../../common/error/errors/missing-data-error';
import { getConfigState } from '../../../config/configs.mock';
import { getCustomerState } from '../../../customer/customers.mock';
import { OrderActionCreator, OrderActionType, OrderRequestBody } from '../../../order';
import { OrderFinalizationNotRequiredError } from '../../../order/errors';
import { getOrderRequestBody } from '../../../order/internal-orders.mock';
import { createPaymentClient, createPaymentStrategyRegistry, PaymentMethod, PaymentMethodActionCreator } from '../../../payment';
import { getPaymentMethodsState, getZip } from '../../../payment/payment-methods.mock';
import { getZipScriptMock } from '../../../payment/strategies/zip/zip.mock';
import PaymentMethodRequestSender from '../../payment-method-request-sender';
import { PaymentInitializeOptions } from '../../payment-request-options';
import PaymentStrategyActionCreator from '../../payment-strategy-action-creator';
import PaymentStrategy from '../payment-strategy';

import { Zip, ZipScriptLoader } from './';
import ZipPaymentStrategy from './zip-payment-strategy';

describe('ZipPaymentStrategy', () => {
    let orderActionCreator: OrderActionCreator;
    let paymentMethodActionCreator: PaymentMethodActionCreator;
    let paymentStrategyActionCreator: PaymentStrategyActionCreator;
    let paymentMethodMock: PaymentMethod;
    let requestSender: RequestSender;
    let store: CheckoutStore;
    let scriptLoader: ScriptLoader;
    let strategy: PaymentStrategy;
    let zipClient: Zip;
    let zipScriptLoader: ZipScriptLoader;

    beforeEach(() => {
        paymentMethodMock = { ...getZip() };
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

        zipClient = getZipScriptMock(true);

        zipScriptLoader = new ZipScriptLoader(scriptLoader);

        jest.spyOn(zipScriptLoader, 'load')
            .mockReturnValue(Promise.resolve(zipClient));
        jest.spyOn(zipClient.Checkout, 'init');

        requestSender = createRequestSender();
        jest.spyOn(requestSender, 'post').mockReturnValue(Promise.resolve());

        const paymentClient = createPaymentClient(store);
        const registry = createPaymentStrategyRegistry(store, paymentClient, requestSender);
        const _requestSender: PaymentMethodRequestSender = new PaymentMethodRequestSender(requestSender);

        orderActionCreator = new OrderActionCreator(paymentClient, new CheckoutValidator(new CheckoutRequestSender(createRequestSender())));
        paymentStrategyActionCreator = new PaymentStrategyActionCreator(registry, orderActionCreator);

        paymentMethodActionCreator = new PaymentMethodActionCreator(_requestSender);

        jest.spyOn(paymentStrategyActionCreator, 'widgetInteraction').mockImplementation(cb => cb());

        jest.spyOn(requestSender, 'post');

        strategy = new ZipPaymentStrategy(
            store,
            paymentMethodActionCreator,
            paymentStrategyActionCreator,
            requestSender,
            zipScriptLoader
        );

        jest.spyOn(requestSender, 'post');
        jest.spyOn(paymentMethodActionCreator, 'loadPaymentMethod');
    });

    it('creates an instance of ZipPaymentStrategy', () => {
        expect(strategy).toBeInstanceOf(ZipPaymentStrategy);
    });

    describe('#initialize()', () => {
        let zipOptions: PaymentInitializeOptions;

        beforeEach(() => {
            zipOptions = { methodId: 'zip' };
        });

        it('loads zip lightbox script', async () => {
            await strategy.initialize(zipOptions);

            expect(zipScriptLoader.load).toHaveBeenCalled();
        });

        it('does not load zip if initialization data is not provided', async () => {
            jest.spyOn(store.getState().paymentMethods, 'getPaymentMethod')
                .mockReturnValue(undefined);
            try {
                await strategy.initialize(zipOptions);
            } catch (error) {
                expect(error).toBeInstanceOf(MissingDataError);
                expect(zipScriptLoader.load).not.toHaveBeenCalled();

            }
        });
    });

    describe('#execute()', () => {
        let zipOptions: PaymentInitializeOptions;
        let orderRequestBody: OrderRequestBody;

        beforeEach(async () => {
            orderRequestBody = getOrderRequestBody();
            zipOptions = { methodId: 'zip' };

            await strategy.initialize(zipOptions);
        });

        it('dispatch widget interaction when execute is called', async () => {
            await strategy.execute(orderRequestBody, zipOptions);

            expect(store.dispatch).toHaveBeenCalled();
        });

        it('expect to get the payment method', async () => {
            await strategy.execute(orderRequestBody, zipOptions);

            expect(store.getState().paymentMethods.getPaymentMethod).toHaveBeenCalledWith(zipOptions.methodId);
        });

        it('returns the payment information', async () => {
            await strategy.execute(orderRequestBody, zipOptions);

            expect(store.getState).toHaveBeenCalled();
        });

        it('succesfully dispatches widget Interaction', async () => {
            await strategy.execute(orderRequestBody, zipOptions);

            expect(paymentMethodActionCreator.loadPaymentMethod).toHaveBeenCalledWith('zip');
            expect(store.getState().paymentMethods.getPaymentMethod).toHaveBeenCalledWith('zip');
        });

        it('inits the checkout of zipClient with the expected payload', async () => {
            const expectedPayload =  {
                onComplete: expect.any(Function),
                onCheckout: expect.any(Function),
            };
            await strategy.execute(orderRequestBody, zipOptions);

            expect(zipClient.Checkout.init).toHaveBeenCalledWith(expectedPayload);
        });

        it('completes the checkout and call request sender to submit status', async () => {
            await strategy.execute(orderRequestBody, zipOptions);

            expect(requestSender.post).toBeCalled();
        });

        it('cancels the checkout if the lightbox is closed', async () => {
            zipClient = getZipScriptMock(false);
            jest.spyOn(zipScriptLoader, 'load')
                .mockReturnValueOnce(Promise.resolve(zipClient));
            await strategy.initialize(zipOptions);
            await strategy.execute(orderRequestBody, zipOptions);

            expect(requestSender.post).not.toBeCalled();
        });
    });

    describe('#deinitialize()', () => {
        let zipOptions: PaymentInitializeOptions;
        let submitOrderAction: Observable<Action>;

        beforeEach(async () => {
            zipOptions = { methodId: 'zip' };
            submitOrderAction = of(createAction(OrderActionType.SubmitOrderRequested));
            orderActionCreator.submitOrder = jest.fn(() => submitOrderAction);

            await strategy.initialize(zipOptions);
        });

        it('expect to not call the orderActionCreator', async () => {
            await strategy.deinitialize(zipOptions);

            expect(orderActionCreator.submitOrder).not.toHaveBeenCalled();
        });

        it('deinitializes strategy', async () => {
            await strategy.deinitialize();
            expect(await strategy.deinitialize()).toEqual(store.getState());
        });
    });

    describe('#finalize()', () => {
        it('throws error to inform that order finalization is not required', async () => {
            try {
                await strategy.finalize();
            } catch (error) {
                expect(error).toBeInstanceOf(OrderFinalizationNotRequiredError);
            }
        });
    });
});

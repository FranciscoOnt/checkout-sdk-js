import { createClient as createPaymentClient } from '@bigcommerce/bigpay-client';
import { createAction } from '@bigcommerce/data-store';
import { createRequestSender, RequestSender } from '@bigcommerce/request-sender';
import { createScriptLoader, ScriptLoader } from '@bigcommerce/script-loader';
import { merge, noop, omit } from 'lodash';
import { of, Observable } from 'rxjs';

import { createCheckoutStore, CheckoutRequestSender, CheckoutStore, CheckoutValidator } from '../../../checkout';
import { getCheckoutStoreState } from '../../../checkout/checkouts.mock';
import { InvalidArgumentError, MissingDataError, MissingDataErrorType } from '../../../common/error/errors';
import { FinalizeOrderAction, OrderActionCreator, OrderActionType, OrderRequestBody, OrderRequestSender, SubmitOrderAction } from '../../../order';
import { OrderFinalizationNotRequiredError } from '../../../order/errors';
import { getIncompleteOrder, getOrderRequestBody, getSubmittedOrder } from '../../../order/internal-orders.mock';
import { getOrder } from '../../../order/orders.mock';
import { createPaymentStrategyRegistry, PaymentActionCreator, PaymentMethod, PaymentMethodActionCreator } from '../../../payment';
import { getAmazonMaxo } from '../../../payment/payment-methods.mock';
import { AmazonMaxoPaymentProcessor, AmazonMaxoPlacement } from '../../../payment/strategies/amazon-maxo';
import { createSpamProtection, SpamProtectionActionCreator, SpamProtectionRequestSender } from '../../../spam-protection';
import { InitializeOffsitePaymentAction, PaymentActionType } from '../../payment-actions';
import PaymentMethodRequestSender from '../../payment-method-request-sender';
import { PaymentInitializeOptions, PaymentRequestOptions } from '../../payment-request-options';
import PaymentRequestSender from '../../payment-request-sender';
import PaymentRequestTransformer from '../../payment-request-transformer';
import * as paymentStatusTypes from '../../payment-status-types';
import PaymentStrategyActionCreator from '../../payment-strategy-action-creator';

import { AmazonMaxoButtonParams } from './amazon-maxo';
import AmazonMaxoPaymentInitializeOptions from './amazon-maxo-payment-initialize-options';
import AmazonMaxoPaymentStrategy from './amazon-maxo-payment-strategy';
import createAmazonMaxoPaymentProcessor from './create-amazon-maxo-payment-processor';

describe('AmazonMaxoPaymentStrategy', () => {
    let finalizeOrderAction: Observable<FinalizeOrderAction>;
    let initializeOffsitePaymentAction: Observable<InitializeOffsitePaymentAction>;
    let orderActionCreator: OrderActionCreator;
    let options: PaymentRequestOptions;
    let payload: OrderRequestBody;
    let paymentMethodMock: PaymentMethod;
    let store: CheckoutStore;
    let strategy: AmazonMaxoPaymentStrategy;
    let submitOrderAction: Observable<SubmitOrderAction>;
    let paymentStrategyActionCreator: PaymentStrategyActionCreator;
    let paymentMethodActionCreator: PaymentMethodActionCreator;
    let amazonMaxoPaymentProcessor: AmazonMaxoPaymentProcessor;
    let requestSender: RequestSender;
    let signInCustomer: jest.Mock;
    let container: HTMLDivElement;
    let editShippingButton: HTMLDivElement;
    let editBillingButton: HTMLDivElement;

    beforeEach(() => {
        store = createCheckoutStore(getCheckoutStoreState());
        amazonMaxoPaymentProcessor = createAmazonMaxoPaymentProcessor(store);
        requestSender = createRequestSender();
        signInCustomer = jest.fn();

        const paymentClient = createPaymentClient(store);
        const spamProtection = createSpamProtection(createScriptLoader());
        const registry = createPaymentStrategyRegistry(store, paymentClient, requestSender, spamProtection, 'en_US');
        const paymentMethodRequestSender: PaymentMethodRequestSender = new PaymentMethodRequestSender(requestSender);

        // const checkoutRequestSender = new CheckoutRequestSender(createRequestSender());
        // const configRequestSender = new ConfigRequestSender(createRequestSender());
        // const configActionCreator = new ConfigActionCreator(configRequestSender);

        orderActionCreator = new OrderActionCreator(
            new OrderRequestSender(createRequestSender()),
            new CheckoutValidator(new CheckoutRequestSender(createRequestSender()))
        );

        paymentStrategyActionCreator = new PaymentStrategyActionCreator(
            registry,
            orderActionCreator,
            new SpamProtectionActionCreator(spamProtection, new SpamProtectionRequestSender(requestSender))
        );

        paymentMethodActionCreator = new PaymentMethodActionCreator(paymentMethodRequestSender);

        finalizeOrderAction = of(createAction(OrderActionType.FinalizeOrderRequested));
        initializeOffsitePaymentAction = of(createAction(PaymentActionType.InitializeOffsitePaymentRequested));
        submitOrderAction = of(createAction(OrderActionType.SubmitOrderRequested));
        options = { methodId: 'foobar' };
        payload = merge(getOrderRequestBody(), {
            payment: {
                methodId: options.methodId,
                paymentData: null,
            },
        });
        paymentMethodMock = { ...getAmazonMaxo(), initializationData: { paymentToken: undefined } };

        container = document.createElement('div');
        container.setAttribute('id', 'container');
        document.body.appendChild(container);

        editShippingButton = document.createElement('div');
        editShippingButton.setAttribute('id', 'edit-shipping-address-button');
        document.body.appendChild(editShippingButton);

        editBillingButton = document.createElement('div');
        editBillingButton.setAttribute('id', 'edit-billing-address-button');
        document.body.appendChild(editBillingButton);

        jest.spyOn(store, 'dispatch');

        jest.spyOn(amazonMaxoPaymentProcessor, 'initialize')
            .mockReturnValue(Promise.resolve());

        jest.spyOn(amazonMaxoPaymentProcessor, 'createButton')
            .mockReturnValue(container);

        jest.spyOn(amazonMaxoPaymentProcessor, 'bindButton')
            .mockImplementation(() => {});

        jest.spyOn(orderActionCreator, 'finalizeOrder')
            .mockReturnValue(finalizeOrderAction);

        jest.spyOn(orderActionCreator, 'submitOrder')
            .mockReturnValue(submitOrderAction);

        jest.spyOn(paymentMethodActionCreator, 'loadPaymentMethod')
            .mockResolvedValue(store.getState());

        jest.spyOn(paymentStrategyActionCreator, 'widgetInteraction')
            .mockResolvedValue(store.getState());

        jest.spyOn(store.getState().paymentMethods, 'getPaymentMethod')
            .mockReturnValue(paymentMethodMock);

        strategy = new AmazonMaxoPaymentStrategy(store,
            paymentStrategyActionCreator,
            paymentMethodActionCreator,
            amazonMaxoPaymentProcessor
        );
    });

    afterEach(() => {
        document.body.removeChild(container);

        if (editShippingButton.parentElement === document.body) {
            document.body.removeChild(editShippingButton);
        } else {
            const shippingButton = document.getElementById('edit-shipping-address-button');
            if (shippingButton) {
                document.body.removeChild(shippingButton);
            }
        }

        if (editShippingButton.parentElement === document.body) {
            document.body.removeChild(editBillingButton);
        } else {
            const billingButton = document.getElementById('edit-billing-address-button');
            if (billingButton) {
                document.body.removeChild(billingButton);
            }
        }
    });

    it('creates an instance of AmazonMaxoPaymentStrategy', () => {
        expect(strategy).toBeInstanceOf(AmazonMaxoPaymentStrategy);
    });

    describe('#initialize()', () => {
        let amazonmaxoInitializeOptions: AmazonMaxoPaymentInitializeOptions;
        let initializeOptions: PaymentInitializeOptions;
        const paymentToken = 'abc123';
        const billingId = 'edit-billing-address-button';
        const shippingId = 'edit-shipping-address-button';

        beforeEach(() => {
            amazonmaxoInitializeOptions = { container: 'container', signInCustomer };
            initializeOptions = { methodId: 'amazonmaxo', amazonmaxo: amazonmaxoInitializeOptions };
        });

        it('creates the signing button if no paymentToken is present on initializationData', async () => {
            await strategy.initialize(initializeOptions);

            expect(amazonMaxoPaymentProcessor.bindButton).not.toHaveBeenCalled();
            expect(amazonMaxoPaymentProcessor.initialize).toHaveBeenCalledWith(paymentMethodMock.id);
            expect(amazonMaxoPaymentProcessor.createButton).toHaveBeenCalledWith(`#${amazonmaxoInitializeOptions.container}`, expect.any(Object));
        });

        it('binds edit buttons if paymentToken is present on initializationData', async () => {
            paymentMethodMock.initializationData.paymentToken = paymentToken;

            await strategy.initialize(initializeOptions);

            expect(amazonMaxoPaymentProcessor.createButton).not.toHaveBeenCalled();
            expect(amazonMaxoPaymentProcessor.initialize).toHaveBeenCalledWith(paymentMethodMock.id);
            expect(amazonMaxoPaymentProcessor.bindButton).toHaveBeenCalledWith(`#${shippingId}`, paymentToken);
            expect(amazonMaxoPaymentProcessor.bindButton).toHaveBeenCalledWith(`#${billingId}`, paymentToken);
        });

        it('dispatches widgetInteraction when clicking previously binded buttons', async () => {
            paymentMethodMock.initializationData.paymentToken = paymentToken;

            await strategy.initialize(initializeOptions);

            const editButton = document.getElementById(shippingId);
            editButton.click();

            expect(paymentStrategyActionCreator.widgetInteraction).toHaveBeenCalled();
        });

        it('does not initialize the paymentProcessor if no options.amazonmaxo are provided', () => {
            initializeOptions.amazonmaxo = undefined;

            expect(() => strategy.initialize(initializeOptions)).toThrow(InvalidArgumentError);
            expect(amazonMaxoPaymentProcessor.initialize).not.toHaveBeenCalled();
        });

        it('does not initialize the paymentProcessor if no options.methodId are provided', () => {
            initializeOptions.methodId = undefined;

            expect(() => strategy.initialize(initializeOptions)).toThrow(MissingDataError);
            expect(amazonMaxoPaymentProcessor.initialize).not.toHaveBeenCalled();
        });

        it('does not initialize the paymentProcessor if payment method is missing', () => {
            jest.spyOn(store.getState().paymentMethods, 'getPaymentMethod')
                .mockReturnValue(undefined);

            expect(strategy.initialize(initializeOptions)).rejects.toThrow(MissingDataError);
            expect(amazonMaxoPaymentProcessor.initialize).not.toHaveBeenCalled();
        });

        it('does not bind edit billing address button if button do not exist', async () => {
            document.body.removeChild(editBillingButton);
            paymentMethodMock.initializationData.paymentToken = paymentToken;

            await strategy.initialize(initializeOptions);

            expect(amazonMaxoPaymentProcessor.createButton).not.toHaveBeenCalled();
            expect(amazonMaxoPaymentProcessor.initialize).toHaveBeenCalledWith(paymentMethodMock.id);
            expect(amazonMaxoPaymentProcessor.bindButton).toHaveBeenCalledWith(`#${shippingId}`, paymentToken);
            expect(amazonMaxoPaymentProcessor.bindButton).not.toHaveBeenCalledWith(`#${billingId}`, paymentToken);

            document.body.appendChild(editShippingButton);
        });
    });
});

import { createRequestSender } from '@bigcommerce/request-sender';
import { createScriptLoader } from '@bigcommerce/script-loader';

import { getCartState } from '../../cart/carts.mock';
import { createCheckoutStore, CheckoutStore } from '../../checkout';
import { getCheckoutState } from '../../checkout/checkouts.mock';
import { NotInitializedError } from '../../common/error/errors';
import InvalidArgumentError from '../../common/error/errors/invalid-argument-error';
import MissingDataError from '../../common/error/errors/missing-data-error';
import { getConfigState } from '../../config/configs.mock';
import { PaymentMethod, PaymentMethodActionCreator, PaymentMethodRequestSender } from '../../payment';
import { getPaymentMethodsState, getStripe } from '../../payment/payment-methods.mock';
import { Masterpass, StripeScriptLoader } from '../../payment/strategies/stripe';
import { getStripeScriptMock } from '../../payment/strategies/stripe/stripe.mock';
import { RemoteCheckoutActionCreator, RemoteCheckoutRequestSender } from '../../remote-checkout';
import { CustomerInitializeOptions } from '../customer-request-options';
import { getCustomerState } from '../customers.mock';

import CustomerStrategy from './customer-strategy';
import StripeCustomerStrategy from './stripe-customer-strategy';

describe('StripeCustomerStrategy', () => {
    let container: HTMLDivElement;
    let paymentMethodActionCreator: PaymentMethodActionCreator;
    let paymentMethodMock: PaymentMethod;
    let remoteCheckoutActionCreator: RemoteCheckoutActionCreator;
    let store: CheckoutStore;
    let strategy: CustomerStrategy;
    let stripeScriptLoader: StripeScriptLoader;
    let Masterpass: Masterpass;

    beforeEach(() => {
        paymentMethodMock = { ...getStripe(), initializationData: { checkoutId: 'checkoutId', masterpassEnabled: true, allowedCardTypes: ['visa', 'amex', 'mastercard'] } };

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

        remoteCheckoutActionCreator = new RemoteCheckoutActionCreator(
            new RemoteCheckoutRequestSender(createRequestSender())
        );

        Masterpass = getStripeScriptMock();

        stripeScriptLoader = new StripeScriptLoader(createScriptLoader());

        jest.spyOn(stripeScriptLoader, 'load')
            .mockReturnValue(Promise.resolve(Masterpass));

        paymentMethodActionCreator = new PaymentMethodActionCreator(new PaymentMethodRequestSender(createRequestSender()));
        strategy = new StripeCustomerStrategy(
            store,
            paymentMethodActionCreator,
            remoteCheckoutActionCreator,
            stripeScriptLoader
        );

        container = document.createElement('div');
        container.setAttribute('id', 'login');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    it('creates an instance of StripeCustomerStrategy', () => {
        expect(strategy).toBeInstanceOf(StripeCustomerStrategy);
    });

    describe('#initialize()', () => {
        let stripeOptions: CustomerInitializeOptions;

        beforeEach(() => {
            stripeOptions = { methodId: 'stripe', stripe: { container: 'login' } };
        });

        it('loads masterpass script in test mode if enabled', async () => {
            paymentMethodMock.config.testMode = true;

            await strategy.initialize(stripeOptions);

            expect(stripeScriptLoader.load).toHaveBeenLastCalledWith(true);
        });

        it('loads masterpass without test mode if disabled', async () => {
            paymentMethodMock.config.testMode = false;

            await strategy.initialize(stripeOptions);

            expect(stripeScriptLoader.load).toHaveBeenLastCalledWith(false);
        });

        it('fails to initialize the strategy if no methodid is supplied', async () => {
            stripeOptions = { methodId: undefined, stripe: { container: 'login' } };
            try {
                await strategy.initialize(stripeOptions);
            } catch (e) {
                expect(e).toBeInstanceOf(InvalidArgumentError);
            }
        });

        it('fails to initialize the strategy if no cart is supplied', async () => {
            jest.spyOn(store.getState().cart, 'getCart')
                .mockReturnValue(undefined);
            try {
                await strategy.initialize(stripeOptions);
            } catch (e) {
                expect(e).toBeInstanceOf(MissingDataError);
            }
        });

        it('fails to initialize the strategy if no storeConfig is supplied', async () => {
            jest.spyOn(store.getState().config, 'getStoreConfig')
                .mockReturnValue(undefined);
            try {
                await strategy.initialize(stripeOptions);
            } catch (e) {
                expect(e).toBeInstanceOf(MissingDataError);
            }
        });

        it('fails to initialize the strategy if no checkoutId is supplied', async () => {
            paymentMethodMock.initializationData.checkoutId = undefined;
            try {
                await strategy.initialize(stripeOptions);
            } catch (e) {
                expect(e).toBeInstanceOf(NotInitializedError);
            }
        });

        it('fails to initialize the strategy ifmasterpass is not enabled', async () => {
            paymentMethodMock.initializationData.masterpassEnabled = undefined;
            try {
                await strategy.initialize(stripeOptions);
            } catch (e) {
                expect(e).toBeInstanceOf(NotInitializedError);
            }
        });

        it('proceeds to checkout if masterpass button is clicked', async () => {
            jest.spyOn(Masterpass, 'checkout');
            await strategy.initialize(stripeOptions);
            const masterpassButton = document.getElementById('mpbutton');
            if (masterpassButton) {
                masterpassButton.click();
                expect(Masterpass.checkout).toHaveBeenCalled();
            }
        });
    });

    describe('#signIn()', () => {
        beforeEach(async () => {
            await strategy.initialize({ methodId: 'stripe', stripe: { container: 'login' } });
        });

        it('throws error if trying to sign in programmatically', async () => {
            expect(() => strategy.signIn({ email: 'foo@bar.com', password: 'foobar' })).toThrowError();
        });
    });

    describe('#signOut()', () => {
        beforeEach(async () => {
            const paymentId = {
                providerId: 'stripe',
            };

            jest.spyOn(store.getState().payment, 'getPaymentId').mockReturnValue(paymentId);

            jest.spyOn(remoteCheckoutActionCreator, 'signOut')
                .mockReturnValue('data');

            await strategy.initialize({ methodId: 'stripe', stripe: { container: 'login' } });
        });

        it('throws error if trying to sign out programmatically', async () => {
            const options = {
                methodId: 'stripe',
            };

            await strategy.signOut(options);

            expect(remoteCheckoutActionCreator.signOut).toHaveBeenCalledWith('stripe', options);
            expect(store.dispatch).toHaveBeenCalled();
        });
    });
});

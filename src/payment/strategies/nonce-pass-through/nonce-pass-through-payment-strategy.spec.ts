// import { createClient as createPaymentClient } from '@bigcommerce/bigpay-client';
// import { createAction } from '@bigcommerce/data-store';
// import { createRequestSender } from '@bigcommerce/request-sender';
// import { of, Observable } from 'rxjs';

// import { createCheckoutStore, CheckoutRequestSender, CheckoutStore, CheckoutValidator } from '../../../checkout';
// import { getCheckoutStoreState } from '../../../checkout/checkouts.mock';
// import { InvalidArgumentError, MissingDataError } from '../../../common/error/errors';
// import { OrderActionCreator, OrderActionType, OrderRequestBody, OrderRequestSender, SubmitOrderAction } from '../../../order';
// import { OrderFinalizationNotRequiredError } from '../../../order/errors';
// import PaymentActionCreator from '../../payment-action-creator';
// import { PaymentActionType, SubmitPaymentAction } from '../../payment-actions';
// import { PaymentRequestOptions } from '../../payment-request-options';
// import PaymentRequestSender from '../../payment-request-sender';
// import PaymentRequestTransformer from '../../payment-request-transformer';

// import NoncePassThroughPaymentStrategy from './nonce-pass-through-payment-strategy';

// describe('NoncePassThroughPaymentStrategy', () => {
//     let orderActionCreator: OrderActionCreator;
//     let paymentRequestTransformer: PaymentRequestTransformer;
//     let paymentRequestSender: PaymentRequestSender;
//     let paymentActionCreator: PaymentActionCreator;
//     let options: PaymentRequestOptions;
//     let payload: OrderRequestBody;
//     let store: CheckoutStore;
//     let strategy: NoncePassThroughPaymentStrategy;
//     let submitOrderAction: Observable<SubmitOrderAction>;
//     let submitPaymentAction: Observable<SubmitPaymentAction>;

//     beforeEach(() => {
//         store = createCheckoutStore(getCheckoutStoreState());
//         orderActionCreator = new OrderActionCreator(
//             new OrderRequestSender(createRequestSender()),
//             new CheckoutValidator(new CheckoutRequestSender(createRequestSender()))
//         );
//         paymentRequestTransformer = new PaymentRequestTransformer();
//         paymentRequestSender = new PaymentRequestSender(createPaymentClient());
//         paymentActionCreator = new PaymentActionCreator(
//             paymentRequestSender,
//             orderActionCreator,
//             paymentRequestTransformer
//         );
//         submitOrderAction = of(createAction(OrderActionType.SubmitOrderRequested));
//         submitPaymentAction = of(createAction(PaymentActionType.SubmitPaymentRequested));

//         payload = {
//             payment: {
//                 methodId: 'foobar',
//                 paymentData: {
//                     nonce: 'fooNonce',
//                 },
//             },
//         };
//         options = { methodId: 'foobar' };

//         jest.spyOn(store, 'dispatch');

//         jest.spyOn(orderActionCreator, 'submitOrder')
//             .mockReturnValue(submitOrderAction);

//         jest.spyOn(paymentActionCreator, 'submitPayment')
//             .mockReturnValue(submitPaymentAction);

//         strategy = new NoncePassThroughPaymentStrategy(store, orderActionCreator, paymentActionCreator);
//     });

//     it('returns checkout state when initializing the strategy', async () => {
//         return expect(strategy.initialize()).resolves.toEqual(store.getState());
//     });

//     it('returns checkout state when deinitializing the strategy', async () => {
//         return expect(strategy.deinitialize()).resolves.toEqual(store.getState());
//     });

//     it('does not finalize the strategy as it is not required', async () => {
//         await expect(strategy.finalize()).rejects.toThrow(OrderFinalizationNotRequiredError);
//     });

//     it('executes the strategy successfully', async () => {
//         const expectedPayload = {
//             methodId: 'foobar',
//             paymentData: {
//                 nonce: 'fooNonce',
//             },
//         };
//         await strategy.execute(payload, options);
//         expect(store.dispatch).toHaveBeenCalledWith(submitOrderAction);
//         expect(store.dispatch).toHaveBeenCalledWith(submitPaymentAction);
//         expect(paymentActionCreator.submitPayment).toHaveBeenCalledWith(expectedPayload);
//     });

//     it('fails to execute the strategy if no payment is provided', async () => {
//         payload.payment = undefined;

//         await expect(strategy.execute(payload, options)).rejects.toThrow(InvalidArgumentError);
//     });

//     it('fails to execute the strategy if no method id is provided', async () => {
//         payload.payment = {
//             methodId: '',
//         };

//         await expect(strategy.execute(payload, options)).rejects.toThrow(MissingDataError);
//     });

//     it('fails to execute the strategy if no nonce is provided', async () => {
//         payload.payment = {
//             methodId: 'foobar',
//             paymentData: { },
//         };

//         await expect(strategy.execute(payload, options)).rejects.toThrow(MissingDataError);
//     });
// });

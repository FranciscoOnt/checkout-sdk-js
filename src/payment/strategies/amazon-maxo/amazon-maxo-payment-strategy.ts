import { CheckoutStore, InternalCheckoutSelectors } from '../../../checkout';
import { InvalidArgumentError, MissingDataError, MissingDataErrorType, NotInitializedError, NotInitializedErrorType, RequestError } from '../../../common/error/errors';
import { OrderRequestBody } from '../../../order';
import PaymentMethod from '../../payment-method';
import { PaymentInitializeOptions, PaymentRequestOptions } from '../../payment-request-options';
import PaymentStrategy from '../payment-strategy';

import { AmazonMaxoHostWindow } from './amazon-maxo';
import AmazonMaxoScriptLoader from './amazon-maxo-script-loader';

export default class AmazonMaxoPaymentStrategy implements PaymentStrategy {

    private _paymentMethod?: PaymentMethod;
    private _window: AmazonMaxoHostWindow;
    private _isPaymentMethodSelected: boolean;

    constructor(
        private _store: CheckoutStore,
        private _amazonMaxoScriptLoader: AmazonMaxoScriptLoader
    ) {
        this._window = window;
        this._isPaymentMethodSelected = false;
    }

    initialize(options: PaymentInitializeOptions): Promise<InternalCheckoutSelectors> {
        const { amazonmaxo: amazonMaxoOptions, methodId } = options;
        const state = this._store.getState();
        const paymentMethod = state.paymentMethods.getPaymentMethod(methodId);

        if (!amazonMaxoOptions) {
            throw new InvalidArgumentError('Unable to initialize payment because "options.amazonmaxo" argument is not provided.');
        }

        if (!paymentMethod) {
            throw new MissingDataError(MissingDataErrorType.MissingPaymentMethod);
        }

        return this._amazonMaxoScriptLoader.load(paymentMethod).then();

    }

    execute(payload: OrderRequestBody, options?: PaymentRequestOptions | undefined): Promise<InternalCheckoutSelectors> {
        throw new Error('Method not implemented.');
    }
    finalize(options?: PaymentRequestOptions | undefined): Promise<InternalCheckoutSelectors> {
        throw new Error('Method not implemented.');
    }
    deinitialize(options?: PaymentRequestOptions | undefined): Promise<InternalCheckoutSelectors> {
        throw new Error('Method not implemented.');
    }
}

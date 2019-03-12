import { RequestSender } from '@bigcommerce/request-sender';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { CheckoutStore, InternalCheckoutSelectors } from '../../../checkout';
import {
    MissingDataError,
    MissingDataErrorType,
    NotInitializedError,
    NotInitializedErrorType,
} from '../../../common/error/errors';
import { toFormUrlEncoded } from '../../../common/http-request';
import { bindDecorator as bind } from '../../../common/utility';
import { OrderRequestBody } from '../../../order';
import { OrderFinalizationNotRequiredError } from '../../../order/errors';
import { PaymentMethodCancelledError } from '../../errors';
import PaymentMethod from '../../payment-method';
import PaymentMethodActionCreator from '../../payment-method-action-creator';
import { PaymentInitializeOptions, PaymentRequestOptions } from '../../payment-request-options';
import PaymentStrategyActionCreator from '../../payment-strategy-action-creator';
import PaymentStrategy from '../payment-strategy';

import { Zip, ZipModalEvent, ZipPayload, ZipPostResponse, ZipResponse, ZipScriptLoader } from './';

export default class ZipPaymentStrategy implements PaymentStrategy {
    private _lightboxEvents$: Subject<{ type: ZipModalEvent }>;
    private _methodId!: string;
    private _paymentMethod?: PaymentMethod;
    private _zipClient?: Zip;

    constructor(
        private _store: CheckoutStore,
        private _paymentMethodActionCreator: PaymentMethodActionCreator,
        private _paymentStrategyActionCreator: PaymentStrategyActionCreator,
        private _requestSender: RequestSender,
        private _zipScriptLoader: ZipScriptLoader
    ) {
        this._lightboxEvents$ = new Subject();
    }

    initialize(options: PaymentInitializeOptions): Promise<InternalCheckoutSelectors> {
        this._methodId = options.methodId;

        this._paymentMethod = this._store.getState().paymentMethods.getPaymentMethod(this._methodId);

        if (!this._paymentMethod) {
            throw new MissingDataError(MissingDataErrorType.MissingPaymentMethod);
        }

        return this._zipScriptLoader.load()
            .then(zip => {
                this._zipClient = zip;

                return this._store.getState();
            });
    }

    deinitialize(options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
        this._paymentMethod = undefined;
        this._zipClient = undefined;

        return Promise.resolve(this._store.getState());
    }

    execute(payload: OrderRequestBody, options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
        if (!this._paymentMethod) {
            throw new MissingDataError(MissingDataErrorType.MissingPaymentMethod);
        }

        return this._displayZip();
    }

    finalize(options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
        return Promise.reject(new OrderFinalizationNotRequiredError());
    }

    private _displayZip(): Promise<InternalCheckoutSelectors> {
        return this._store.dispatch(this._paymentStrategyActionCreator.widgetInteraction(() => {
            this._store.dispatch(this._paymentMethodActionCreator.loadPaymentMethod(this._methodId))
                .then(state => {
                    if (!this._zipClient) {
                        throw new NotInitializedError(NotInitializedErrorType.PaymentNotInitialized);
                    }

                    this._zipClient.Checkout.init(this._getZipPayload());
                });

            // Lightbox closing event listener
            return new Promise((resolve, reject) => {
                this._lightboxEvents$
                    .pipe(take(1))
                    .subscribe((event: { type: ZipModalEvent }) => {
                        if (event.type === ZipModalEvent.CancelCheckout) {
                            reject(new PaymentMethodCancelledError());
                        }
                    });
            });
        }, { methodId: this._methodId }), { queueId: 'widgetInteraction' });
    }

    private _getZipPayload(): ZipPayload {
        return {
            onComplete: this._handleResponse,
            onCheckout: this._fetchPayload,
        };
    }

    @bind
    private _fetchPayload(resolve: (response: ZipPostResponse) => void): void {
        this._store.dispatch(this._paymentMethodActionCreator.loadPaymentMethod(this._methodId))
            .then(state => {
                const paymentMethod = state.paymentMethods.getPaymentMethod(this._methodId);

                if (!paymentMethod || !paymentMethod.clientToken) {
                    throw new MissingDataError(MissingDataErrorType.MissingPaymentMethod);
                }

                resolve(JSON.parse(paymentMethod.clientToken));
            });
    }

    @bind
    private _handleResponse(response: ZipResponse): void {
        if (response.state === ZipModalEvent.CancelCheckout) {
            this._lightboxEvents$.next({ type: ZipModalEvent.CancelCheckout });

            return;
        }
        const { state, checkoutId } = response;

        this._requestSender.post('checkout.php', {
            headers: {
                Accept: 'text/html',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: toFormUrlEncoded({
                action: 'set_external_checkout',
                provider: this._methodId,
                state,
                checkoutId,
            }),
        })
            .then(() => this._store.getState());
    }
}

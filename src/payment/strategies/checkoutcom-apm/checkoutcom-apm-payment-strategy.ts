import { FormPoster } from '@bigcommerce/form-poster';
import { some } from 'lodash';

import { CheckoutStore, InternalCheckoutSelectors } from '../../../checkout';
import { NotInitializedError, NotInitializedErrorType, RequestError } from '../../../common/error/errors';
import { HostedFormFactory } from '../../../hosted-form';
import { OrderActionCreator, OrderRequestBody } from '../../../order';
import { OrderFinalizationNotRequiredError } from '../../../order/errors';
import { PaymentArgumentInvalidError } from '../../errors';
import PaymentActionCreator from '../../payment-action-creator';
import { PaymentRequestOptions } from '../../payment-request-options';
import { ThreeDsResult } from '../../payment-response-body';
import * as paymentStatusTypes from '../../payment-status-types';
import { CreditCardPaymentStrategy } from '../credit-card';

export default class CheckoutcomAPMPaymentStrategy extends CreditCardPaymentStrategy {
    constructor(
      protected _store: CheckoutStore,
      protected _orderActionCreator: OrderActionCreator,
      protected _paymentActionCreator: PaymentActionCreator,
      protected _hostedFormFactory: HostedFormFactory,
      protected _formPoster: FormPoster
    ) {
        super(
            _store,
            _orderActionCreator,
            _paymentActionCreator,
            _hostedFormFactory
        );
    }

    finalize(options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
        const state = this._store.getState();
        const order = state.order.getOrder();

        if (order && state.payment.getPaymentStatus() === paymentStatusTypes.FINALIZE) {
            return this._store.dispatch(this._orderActionCreator.finalizeOrder(order.orderId, options));
        }

        return Promise.reject(new OrderFinalizationNotRequiredError());
    }

    protected async _executeWithoutHostedForm(payload: OrderRequestBody, options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
      const { payment, ...order } = payload;
      const paymentData = payment && payment.paymentData;

      if (!payment || !paymentData) {
          throw new PaymentArgumentInvalidError(['payment.paymentData']);
      }

      await this._store.dispatch(this._orderActionCreator.submitOrder(order, options));

      try {
          return await this._store.dispatch(this._paymentActionCreator.submitPayment({ ...payment, paymentData }));
      } catch (error) {
          return this._processResponse(error);
      }
  }

  protected async _executeWithHostedForm(payload: OrderRequestBody, options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors>  {
      const { payment, ...order } = payload;
      const form = this._hostedForm;

      if (!form) {
          throw new NotInitializedError(NotInitializedErrorType.PaymentNotInitialized);
      }

      if (!payment || !payment.methodId) {
          throw new PaymentArgumentInvalidError(['payment.methodId']);
      }

      try {
          await form.validate();
          await this._store.dispatch(this._orderActionCreator.submitOrder(order, options));
          await form.submit(payment);
      } catch (error) {
          return this._processResponse(error);
      }

      return await this._store.dispatch(this._orderActionCreator.loadCurrentOrder());
  }

    private _processResponse(error: RequestError): Promise<InternalCheckoutSelectors> {
        if (!(error instanceof RequestError)) {
            return Promise.reject(error);
        }

        // TODO validate all possible responses and perform respective additional actions
        if (some(error.body.errors, { code: 'three_d_secure_required' })) {
          this._performRedirect(error.body.three_ds_result);
        }

        return Promise.reject(error);
    }

    private _performRedirect(threeDsResult: ThreeDsResult): Promise<InternalCheckoutSelectors> {
        return new Promise(() => this._formPoster.postForm(threeDsResult.acs_url, {
            PaReq: threeDsResult.payer_auth_request || null,
            TermUrl: threeDsResult.callback_url || null,
            MD: threeDsResult.merchant_data || null,
        }));
    }
}

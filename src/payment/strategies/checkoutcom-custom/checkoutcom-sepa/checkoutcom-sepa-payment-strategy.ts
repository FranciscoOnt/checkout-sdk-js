import { InternalCheckoutSelectors } from '../../../../checkout';
import { OrderRequestBody } from '../../../../order';
import { PaymentArgumentInvalidError } from '../../../errors';
import { CheckoutcomSEPAInstrument, PaymentInstrument } from '../../../payment';
import { PaymentRequestOptions } from '../../../payment-request-options';
import CheckoutcomCustomPaymentStrategy from '../checkoutcom-custom-payment-strategy';

export default class CheckoutcomSEPAPaymentStrategy extends CheckoutcomCustomPaymentStrategy {

    protected async _executeWithoutHostedForm(payload: OrderRequestBody, options?: PaymentRequestOptions): Promise<InternalCheckoutSelectors> {
        const { payment, ...order } = payload;
        const paymentData = payment && payment.paymentData;

        if (!payment || !paymentData) {
            throw new PaymentArgumentInvalidError(['payment.paymentData']);
        }

        await this._store.dispatch(this._orderActionCreator.submitOrder(order, options));

        const _paymentData = {
            ...paymentData,
            formattedPayload: this._createFormattedPayload(payment.methodId, paymentData),
        };

        try {
            return await this._store.dispatch(this._paymentActionCreator.submitPayment({ ...payment, paymentData: _paymentData }));
        } catch (error) {
            return this._processResponse(error);
        }
    }

    private _createFormattedPayload(methodId: string, paymentData: PaymentInstrument): CheckoutcomSEPAInstrument {
        const CHECKOUTCOM_SEPA_PAYMENT_METHOD = 'sepa';
        const formattedPayload: CheckoutcomSEPAInstrument = { iban: '', bic: '' };
        const { iban, bic } = paymentData as CheckoutcomSEPAInstrument;

        if (methodId === CHECKOUTCOM_SEPA_PAYMENT_METHOD && document) {
            formattedPayload.iban = iban;
            formattedPayload.bic = bic;
        }

        return formattedPayload;
    }
}

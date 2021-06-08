import { HostedFieldType } from '../../../hosted-form';
import { OrderRequestBody } from '../../../order';
import { PaymentInitializeOptions } from '../../payment-request-options';

export function getHostedFormInitializeOptions(): PaymentInitializeOptions {
    return {
        methodId: 'moneris',
        moneris: {
            containerId: 'moneris_iframe_container',
            form: {
                fields: {
                    [HostedFieldType.CardNumber]: { containerId: 'card-number' },
                    [HostedFieldType.CardExpiry]: { containerId: 'card-expiry' },
                    [HostedFieldType.CardName]: { containerId: 'card-name' },
                },
            },
        },
    };
}

export function getOrderRequestBodyVaultedCC(): OrderRequestBody {
    return {
        useStoreCredit: false,
        payment: {
            methodId: 'moneris',
            paymentData: {
                shouldSaveInstrument: true,
                shouldSetAsDefaultInstrument: true,
                instrumentId: '1234',
            },
        },
    };
}

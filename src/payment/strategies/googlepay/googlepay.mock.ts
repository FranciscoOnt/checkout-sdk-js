import {Cart} from '../../../cart';
import Checkout from '../../../checkout/checkout';
import {Coupon} from '../../../coupon';
import GiftCertificate from '../../../coupon/gift-certificate';
import {Customer} from '../../../customer';
import {Discount} from '../../../discount';
import {Consignment} from '../../../shipping';
import {Tax} from '../../../tax';
import PaymentMethod from '../../payment-method';
import PaymentMethodConfig from '../../payment-method-config';

import {
    GooglePaymentData,
    GooglePayAddress,
    GooglePayBraintreeSDK,
    GooglePayPaymentDataRequestV1,
    GooglePaySDK, GooglePayClient, GooglePayPaymentOptions, TokenizePayload
} from './googlepay';

const mockSDK = {
    isReadyToPay: jest.fn(),
};

export function getGooglePaySDKMock(): GooglePaySDK {
    return {
        payments: {
            api: {
                PaymentsClient: jest.fn(),
            },
        },
    };
}

export function getGooglePayBraintreeMock(): GooglePayBraintreeSDK {
    return {
        createPaymentDataRequest: jest.fn(dataRequest => Promise.resolve(dataRequest as GooglePayPaymentDataRequestV1)),
        parseResponse: jest.fn(),
        teardown: jest.fn(() => Promise.resolve()),
    };
}

export function getCheckoutMock(): Checkout {
    return {
        id: '1',
        cart: {
            currency: {
                code: 'USD',
            },
        } as Cart,
        customer: {} as Customer,
        customerMessage: '',
        consignments: [{}] as Consignment[],
        taxes: [{}] as Tax[],
        discounts: [{}] as Discount[],
        coupons: [{}] as Coupon[],
        shippingCostTotal: 0,
        shippingCostBeforeDiscount: 0,
        handlingCostTotal: 0,
        taxTotal: 0,
        subtotal: 0,
        grandTotal: 1,
        giftCertificates: [{}] as GiftCertificate[],
        balanceDue: 0,
        createdTime: '',
        updatedTime: '',
    };
}

export function getPaymentMethodMock(): PaymentMethod {
    return {
        id: 'id',
        config: {} as PaymentMethodConfig,
        method: 'method',
        supportedCards: [] as string[],
        type: '',
        clientToken: 'token',
        nonce: 'nonce',
        initializationData: {
            platformToken: 'platformToken',
        },
    };
}

export function getGooglePaymentDataPayload() {
    return {
        cardRequirements: {
            billingAddressFormat: 'FULL',
            billingAddressRequired: true,
        },
        emailRequired: true,
        merchantInfo: {
            authJwt: 'platformToken',
        },
        phoneNumberRequired: true,
        shippingAddressRequired: true,
        transactionInfo: {
            currencyCode: 'USD',
            totalPrice: '1',
            totalPriceStatus: 'FINAL',
        },
    };
}

export function getGooglePaymentDataMock(): GooglePaymentData {
    return {
        cardInfo: {
            cardClass: 'cardClass',
            cardDescription: 'cardDescription',
            cardDetails: 'cardDetails',
            cardImageUri: 'cardImageUri',
            cardNetwork: 'cardNetwork',
            billingAddress: {
                name: 'name',
            } as GooglePayAddress,
        },
        paymentMethodToken: {
            token: 'token',
            tokenizationType: 'tokenizationType',
        },
        shippingAddress: {
            name: 'name',
        } as GooglePayAddress,
        email: 'email',
    };
}

export function getGooglePaymentDataDequestV1Mock(): GooglePayPaymentDataRequestV1 {
    return {
        allowedPaymentMethods: ['a', 'b', 'c'],
        apiVersion: 1,
        cardRequirements: {
            allowedCardNetworks: ['a', 'b', 'c'],
            billingAddressFormat: 'format',
            billingAddressRequired: true,
        },
        enviroment: 'test',
        i: {
            googleTransactionId: 'transactionId',
            startTimeMs: 1000,
        },
        merchantInfo: {
            merchantId: 'merchantId',
        },
        paymentMethodTokenizationParameters: {
            parameters: {
                'braintree:apiVersion': '1',
                'braintree:authorizationFingerprint': 'a',
                'braintree:merchantId': 'merchantId',
                'braintree:metadata': 'a',
                'braintree:sdkVersion': '1',
                gateway: 'test',
            },
            tokenizationType: 'a',
        },
        shippingAddressRequired: true,
        transactionInfo: {
            currencyCode: 'US',
            totalPrice: '123.44',
            totalPriceStatus: 'a',
        },
    };
}


export function getTokenizedPayload(): TokenizePayload {
    return {
        nonce: 'nonce',
        details: {
            cardType: 'debit',
            lastFour: '1234',
            lastTwo: '34',
        },
        description: 'description',
        type: 'AndroidPayCard',
        binData: {
            commercial: 'a',
            countryOfIssuance: '',
            debit: '',
            durbinRegulated: '',
            healthcare: '',
            issuingBank: '',
            payroll: '',
            prepaid: '',
            productId: '',
        },
    };
}

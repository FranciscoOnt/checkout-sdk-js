import { InvalidArgumentError } from '../../../common/error/errors';

import GooglePayCheckoutcomInitializer from './googlepay-checkoutcom-initializer';
import { getCheckoutMock, getGooglePaymentCheckoutcomDataMock, getGooglePaymentDataMock, getGooglePayCheckoutcomPaymentDataRequestMock, getGooglePayTokenizePayloadCheckoutcom, getPaymentMethodMock } from './googlepay.mock';

describe('GooglePayCheckoutcomInitializer', () => {
    it('creates an instance of GooglePayCheckoutcomInitializer', () => {
        const googlePayCheckoutcomInitializer = new GooglePayCheckoutcomInitializer();

        expect(googlePayCheckoutcomInitializer).toBeInstanceOf(GooglePayCheckoutcomInitializer);
    });

    describe('#initialize', () => {
        let googlePayCheckoutcomInitializer: GooglePayCheckoutcomInitializer;

        beforeEach(() => {
            googlePayCheckoutcomInitializer = new GooglePayCheckoutcomInitializer();
        });

        it('initializes the google pay configuration for Checkoutcom', async () => {
            const googlePayPaymentDataRequestV2 = await googlePayCheckoutcomInitializer.initialize(
                getCheckoutMock(),
                getPaymentMethodMock(),
                false
            );

            expect(googlePayPaymentDataRequestV2).toEqual(getGooglePayCheckoutcomPaymentDataRequestMock());
        });
    });

    describe('#teardown', () => {
        let googlePayCheckoutcomInitializer: GooglePayCheckoutcomInitializer;

        beforeEach(() => {
            googlePayCheckoutcomInitializer = new GooglePayCheckoutcomInitializer();
        });

        it('teardowns the initializer', async () => {
            await googlePayCheckoutcomInitializer.teardown().then(() => {
                expect(googlePayCheckoutcomInitializer.teardown).toBeDefined();
            });
        });
    });

    describe('#parseResponse', () => {
        let googlePayCheckoutcomInitializer: GooglePayCheckoutcomInitializer;

        beforeEach(() => {
            googlePayCheckoutcomInitializer = new GooglePayCheckoutcomInitializer();
        });

        it('parses a response from google pay payload received', () => {
            const tokenizePayload = googlePayCheckoutcomInitializer.parseResponse(getGooglePaymentCheckoutcomDataMock());

            expect(tokenizePayload).toBeTruthy();
            expect(tokenizePayload).toEqual(getGooglePayTokenizePayloadCheckoutcom());
        });

        it('throws when try to parse a response from google pay payload received', () => {
            try {
                googlePayCheckoutcomInitializer.parseResponse(getGooglePaymentDataMock());
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidArgumentError);
                expect(error).toEqual(new InvalidArgumentError('Unable to parse response from Google Pay.'));
            }
        });
    });
});

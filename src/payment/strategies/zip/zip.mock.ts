import { Zip, ZipResponse } from './zip';

export function getZipScriptMock(approved: boolean): Zip {

    const MockZipResponse: ZipResponse = {
        checkoutId: 'checkoutId',
        customerId: 'customerId',
        state: (approved ? 'approved' : 'cancelled'),
    };

    return {
        Checkout: {
            attachButton: jest.fn(),
            init: jest.fn(payload => {
                payload.onCheckout(jest.fn());
                payload.onComplete(MockZipResponse);
            }),
        },
    };
}

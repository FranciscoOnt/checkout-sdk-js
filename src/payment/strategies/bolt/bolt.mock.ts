import { BoltCallbacks, BoltCheckout, BoltClient, BoltTransaction } from './bolt';

export function getBoltScriptMock(shouldSucced: boolean = false): BoltCheckout {
    return {
        configure: jest.fn((_cart: object, _hints: {}, callbacks?: BoltCallbacks) => {
            return getConfiguredBoltMock(shouldSucced, callbacks || { success: () => {}, close: () => {}});
        }),
        setClientCustomCallbacks: jest.fn(),
    };
}

export function getConfiguredBoltMock(shouldSucced: boolean, callbacks: BoltCallbacks): BoltClient {
    const mockTransaction: BoltTransaction = {
        reference: 'transactionReference',
        id: 'id',
        status: 'complete',
        type: 'authorization',
        processor: 'vantiv',
        date : 1234567890,
        authorization: {
            status: 'approved',
            reason: 'reason',
        },
    };

    const successCallback = (() => {
        if (callbacks.close) {
            callbacks.close();
        }

        return Promise.resolve();
    });

    return {
        open: jest.fn(() => {
            if (shouldSucced) {
                callbacks.success(mockTransaction, successCallback);
            } else {
                if (callbacks.close) {
                    callbacks.close();
                }
            }
        }),
    };
}

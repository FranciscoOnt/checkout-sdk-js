import { BoltCheckout, BoltClient } from './bolt';

export function getBoltScriptMock(): BoltCheckout {
    return {
            configure: jest.fn(),
    };
}

export function getConfiguredBoltMock(): BoltClient {
    return {
            open: jest.fn(),
    };
}

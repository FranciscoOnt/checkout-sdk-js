import { Masterpass } from './stripe';

export function getStripeScriptMock(): Masterpass {
    return {
        checkout: jest.fn(),
    };
}

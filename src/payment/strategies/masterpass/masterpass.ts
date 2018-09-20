export interface Masterpass {
    checkout(options: MasterpassCheckoutOptions): void;
}

export interface MasterpassCheckoutOptions {
    checkoutId: string;
    allowedCardTypes: string[];
    amount: string;
    currency: string;
    cartId: string;
    callbackUrl?: string;
}

export interface MasterpassHostWindow extends Window {
    masterpass?: Masterpass;
}

export type MasterpassCheckoutCallback = () => void;

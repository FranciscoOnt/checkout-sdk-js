export interface Masterpass {
    checkout(options: MasterpassCheckoutOptions): void;
}

export interface MasterpassPaymentInitializeOptions {
    buttonId: string;
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

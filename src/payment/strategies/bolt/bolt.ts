export interface BoltHostWindow extends Window {
    BoltCheckout?: BoltCheckout;
}

export interface BoltCheckout {
    configure(cart: BoltCart, callbacks: BoltCallbacks): BoltClient;
}

export interface BoltClient {
    open(): void;
}

export interface BoltCart {
    orderToken: string;
}

export interface BoltCallbacks {
    check?(): boolean;
    onCheckoutStart?(): void;
    onPaymentSubmit?(): void;
    success(transaction: any, callback: () => void): void;
    close?(): void;
}

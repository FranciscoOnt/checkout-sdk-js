export interface ZipHostWindow extends Window {
    Zip?: Zip;
}

export interface Zip {
    Checkout: ZipCheckout;
}

export interface ZipCheckout {
    attachButton(buttonId: string, params: ZipPayload): void;
    init(args?: any): void;
}

export interface ZipPayload {
    checkoutUri: string;
    redirectUri: string;
    onComplete(args: any): void;
    onError(args: any): void;
}

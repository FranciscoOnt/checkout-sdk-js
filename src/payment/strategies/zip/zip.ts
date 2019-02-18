export interface ZipHostWindow extends Window {
    Zip?: Zip;
}

export interface Zip {
    Checkout: ZipCheckout;
}

export interface ZipCheckout {
    attachButton(buttonId: string, payload: ZipPayload): void;
    init(payload: ZipPayload): void;
}

export interface ZipPayload {
    /**
     * Uri used by Zip lightbox make an AJAX POST to retrieve checkout information.
     */
    checkoutUri?: string;
    /**
     * Uri used by Zip lightbox to redirect when the checkout is completed, checkoutId is provided to this uri as a
     * query param to be handled.
     * If this parameter is not provided, onComplete must be provided.
     */
    redirectUri?: string;
    /**
     * Callback function that is called when the lightbox flow is completed.
     * If this parameter is provided, redirectUri is ignored and this function must handle the checkoutId submission.
     */
    onComplete?(response: ZipResponse): void;
    /**
     * Callback function that is called before the lightbox flow is started.
     * If this parameter is provided, checkoutUri is ignored and this function must handle the post to get a checkoutId.
     */
    onCheckout?(resolve: (response: ZipPostResponse) => void): void;
}

export const enum ZipModalEvent {
    CancelCheckout = 'cancelled',
}

/**
 * Response format returned by onCheckout function or checkoutUri.
 */
export interface ZipPostResponse {
    id: string;
    redirect_uri: string;
    uri: string;
}
/**
 * Response format sent to onComplete function or redirectUri.
 */
export interface ZipResponse {
    checkoutId?: string;
    customerId?: string;
    state: string;
}

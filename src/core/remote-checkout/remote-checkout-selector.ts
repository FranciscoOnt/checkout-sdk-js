import RemoteCheckoutState from './remote-checkout-state';
import RemoteCheckout from './remote-checkout';
import RemoteCheckoutMeta from './remote-checkout-meta';

export default class RemoteCheckoutSelector {
    constructor(
        private _remoteCheckout: RemoteCheckoutState
    ) { }

    getCheckout(): RemoteCheckout | undefined {
        return this._remoteCheckout.data;
    }

    getCheckoutMeta(): RemoteCheckoutMeta | undefined {
        return this._remoteCheckout.meta;
    }

    getInitializeBillingError(): any {
        return this._remoteCheckout.errors.initializeBillingError;
    }

    getInitializeShippingError(): any {
        return this._remoteCheckout.errors.initializeShippingError;
    }

    getInitializePaymentError(): any {
        return this._remoteCheckout.errors.initializePaymentError;
    }

    getSignOutError(): any {
        return this._remoteCheckout.errors.signOutError;
    }

    isInitializingBilling(): boolean {
        return !!this._remoteCheckout.statuses.isInitializingBilling;
    }

    isInitializingShipping(): boolean {
        return !!this._remoteCheckout.statuses.isInitializingShipping;
    }

    isInitializingPayment(): boolean {
        return !!this._remoteCheckout.statuses.isInitializingPayment;
    }

    isSigningOut(): boolean {
        return !!this._remoteCheckout.statuses.isSigningOut;
    }
}
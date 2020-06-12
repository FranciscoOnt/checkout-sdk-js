[@bigcommerce/checkout-sdk](../README.md) › [CheckoutStoreSelector](checkoutstoreselector.md)

# Interface: CheckoutStoreSelector

Responsible for getting the state of the current checkout.

This object has a set of methods that allow you to get a specific piece of
checkout information, such as shipping and billing details.

## Hierarchy

* **CheckoutStoreSelector**

## Index

### Methods

* [getBillingAddress](checkoutstoreselector.md#getbillingaddress)
* [getBillingAddressFields](checkoutstoreselector.md#getbillingaddressfields)
* [getBillingCountries](checkoutstoreselector.md#getbillingcountries)
* [getCart](checkoutstoreselector.md#getcart)
* [getCheckout](checkoutstoreselector.md#getcheckout)
* [getConfig](checkoutstoreselector.md#getconfig)
* [getConsignments](checkoutstoreselector.md#getconsignments)
* [getCoupons](checkoutstoreselector.md#getcoupons)
* [getCustomer](checkoutstoreselector.md#getcustomer)
* [getFlashMessages](checkoutstoreselector.md#getflashmessages)
* [getGiftCertificates](checkoutstoreselector.md#getgiftcertificates)
* [getInstruments](checkoutstoreselector.md#getinstruments)
* [getOrder](checkoutstoreselector.md#getorder)
* [getPaymentMethod](checkoutstoreselector.md#getpaymentmethod)
* [getPaymentMethods](checkoutstoreselector.md#getpaymentmethods)
* [getSelectedPaymentMethod](checkoutstoreselector.md#getselectedpaymentmethod)
* [getSelectedShippingOption](checkoutstoreselector.md#getselectedshippingoption)
* [getShippingAddress](checkoutstoreselector.md#getshippingaddress)
* [getShippingAddressFields](checkoutstoreselector.md#getshippingaddressfields)
* [getShippingCountries](checkoutstoreselector.md#getshippingcountries)
* [getShippingOptions](checkoutstoreselector.md#getshippingoptions)
* [getSignInEmail](checkoutstoreselector.md#getsigninemail)
* [isPaymentDataRequired](checkoutstoreselector.md#ispaymentdatarequired)
* [isPaymentDataSubmitted](checkoutstoreselector.md#ispaymentdatasubmitted)

## Methods

###  getBillingAddress

▸ **getBillingAddress**(): *[BillingAddress](billingaddress.md) | undefined*

Gets the billing address of an order.

<<<<<<< HEAD
<<<<<<< HEAD
**Returns:** *[BillingAddress](billingaddress.md) | undefined*
=======
Gets the billing address of an order.

=======
>>>>>>> build
**Returns:**  [BillingAddress](billingaddress.md) &#124; `undefined`
>>>>>>> build

The billing address object if it is loaded, otherwise undefined.

___

###  getBillingAddressFields

▸ **getBillingAddressFields**(`countryCode`: string): *[FormField](formfield.md)[]*

Gets a set of form fields that should be presented to customers in order
to capture their billing address for a specific country.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`countryCode` | string | A 2-letter country code (ISO 3166-1 alpha-2). |

**Returns:** *[FormField](formfield.md)[]*

The set of billing address form fields if it is loaded,
otherwise undefined.

___

###  getBillingCountries

▸ **getBillingCountries**(): *[Country](country.md)[] | undefined*

Gets a list of countries available for billing.

<<<<<<< HEAD
<<<<<<< HEAD
**Returns:** *[Country](country.md)[] | undefined*
=======
Gets a list of countries available for billing.

=======
>>>>>>> build
**Returns:**  [Country](country.md)[] &#124; `undefined`
>>>>>>> build

The list of countries if it is loaded, otherwise undefined.

___

###  getCart

▸ **getCart**(): *[Cart](cart.md) | undefined*

<<<<<<< HEAD
Gets the current cart.

<<<<<<< HEAD
**Returns:** *[Cart](cart.md) | undefined*
=======
Gets the current cart.

=======
>>>>>>> build
**Returns:**  [Cart](cart.md) &#124; `undefined`
>>>>>>> build

The current cart object if it is loaded, otherwise undefined.

___

###  getCheckout

▸ **getCheckout**(): *[Checkout](checkout.md) | undefined*

<<<<<<< HEAD
Gets the current checkout.

<<<<<<< HEAD
**Returns:** *[Checkout](checkout.md) | undefined*
=======
=======
>>>>>>> build
**Returns:**  [Checkout](checkout.md) &#124; `undefined`
>>>>>>> build

The current checkout if it is loaded, otherwise undefined.

___

###  getConfig

▸ **getConfig**(): *[StoreConfig](storeconfig.md) | undefined*

Gets the checkout configuration of a store.

<<<<<<< HEAD
<<<<<<< HEAD
**Returns:** *[StoreConfig](storeconfig.md) | undefined*
=======
Gets the checkout configuration of a store.

=======
>>>>>>> build
**Returns:**  [StoreConfig](storeconfig.md) &#124; `undefined`
>>>>>>> build

The configuration object if it is loaded, otherwise undefined.

___

###  getConsignments

▸ **getConsignments**(): *[Consignment](consignment.md)[] | undefined*

<<<<<<< HEAD
Gets a list of consignments.

<<<<<<< HEAD
If there are no consignments created for to the current checkout, the
list will be empty.

**Returns:** *[Consignment](consignment.md)[] | undefined*
=======
If there are no consignments created for to the current checkout, the list will be empty.

=======
>>>>>>> build
**Returns:**  [Consignment](consignment.md)[] &#124; `undefined`
>>>>>>> build

The list of consignments if any, otherwise undefined.

___

###  getCoupons

▸ **getCoupons**(): *[Coupon](coupon.md)[] | undefined*

Gets a list of coupons that are applied to the current checkout.

<<<<<<< HEAD
<<<<<<< HEAD
**Returns:** *[Coupon](coupon.md)[] | undefined*
=======
Gets a list of coupons that are applied to the current checkout.

=======
>>>>>>> build
**Returns:**  [Coupon](coupon.md)[] &#124; `undefined`
>>>>>>> build

The list of applied coupons if there is any, otherwise undefined.

___

###  getCustomer

▸ **getCustomer**(): *[Customer](customer.md) | undefined*

<<<<<<< HEAD
Gets the current customer.

<<<<<<< HEAD
**Returns:** *[Customer](customer.md) | undefined*
=======
=======
>>>>>>> build
**Returns:**  [Customer](customer.md) &#124; `undefined`
>>>>>>> build

The current customer object if it is loaded, otherwise
undefined.

___

###  getFlashMessages

▸ **getFlashMessages**(`type?`: [FlashMessageType](../README.md#flashmessagetype)): *[FlashMessage](flashmessage.md)[] | undefined*

Gets the available flash messages.

Flash messages contain messages set by the server,
e.g: when trying to sign in using an invalid email link.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type?` | [FlashMessageType](../README.md#flashmessagetype) | The type of flash messages to be returned. Optional |

**Returns:** *[FlashMessage](flashmessage.md)[] | undefined*

The flash messages if available, otherwise undefined.

___

###  getGiftCertificates

▸ **getGiftCertificates**(): *[GiftCertificate](giftcertificate.md)[] | undefined*

<<<<<<< HEAD
Gets a list of gift certificates that are applied to the current checkout.

<<<<<<< HEAD
**Returns:** *[GiftCertificate](giftcertificate.md)[] | undefined*
=======
=======
>>>>>>> build
**Returns:**  [GiftCertificate](giftcertificate.md)[] &#124; `undefined`
>>>>>>> build

The list of applied gift certificates if there is any, otherwise undefined.

___

###  getInstruments

▸ **getInstruments**(): *[Instrument](../README.md#instrument)[] | undefined*

Gets a list of payment instruments associated with the current customer.

<<<<<<< HEAD
<<<<<<< HEAD
**Returns:** *[Instrument](../README.md#instrument)[] | undefined*
=======
Gets a list of payment instruments associated with the current customer.

=======
>>>>>>> build
**Returns:**  [Instrument](../#instrument)[] &#124; `undefined`
>>>>>>> build

The list of payment instruments if it is loaded, otherwise undefined.

▸ **getInstruments**(`paymentMethod`: [PaymentMethod](paymentmethod.md)): *[PaymentInstrument](../README.md#paymentinstrument)[] | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`paymentMethod` | [PaymentMethod](paymentmethod.md) |

**Returns:** *[PaymentInstrument](../README.md#paymentinstrument)[] | undefined*

___

###  getOrder

▸ **getOrder**(): *[Order](order.md) | undefined*

<<<<<<< HEAD
Gets the current order.

<<<<<<< HEAD
**Returns:** *[Order](order.md) | undefined*
=======
Gets the current order.

=======
>>>>>>> build
**Returns:**  [Order](order.md) &#124; `undefined`
>>>>>>> build

The current order if it is loaded, otherwise undefined.

___

###  getPaymentMethod

▸ **getPaymentMethod**(`methodId`: string, `gatewayId?`: undefined | string): *[PaymentMethod](paymentmethod.md) | undefined*

Gets a payment method by an id.

The method returns undefined if unable to find a payment method with the
specified id, either because it is not available for the customer, or it
is not loaded.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`methodId` | string | The identifier of the payment method. |
`gatewayId?` | undefined &#124; string | The identifier of a payment provider providing the payment method. |

**Returns:** *[PaymentMethod](paymentmethod.md) | undefined*

The payment method object if loaded and available, otherwise,
undefined.

___

###  getPaymentMethods

▸ **getPaymentMethods**(): *[PaymentMethod](paymentmethod.md)[] | undefined*

<<<<<<< HEAD
Gets a list of payment methods available for checkout.

<<<<<<< HEAD
**Returns:** *[PaymentMethod](paymentmethod.md)[] | undefined*
=======
=======
>>>>>>> build
**Returns:**  [PaymentMethod](paymentmethod.md)[] &#124; `undefined`
>>>>>>> build

The list of payment methods if it is loaded, otherwise undefined.

___

###  getSelectedPaymentMethod

▸ **getSelectedPaymentMethod**(): *[PaymentMethod](paymentmethod.md) | undefined*

Gets the payment method that is selected for checkout.

<<<<<<< HEAD
<<<<<<< HEAD
**Returns:** *[PaymentMethod](paymentmethod.md) | undefined*
=======
Gets the payment method that is selected for checkout.

=======
>>>>>>> build
**Returns:**  [PaymentMethod](paymentmethod.md) &#124; `undefined`
>>>>>>> build

The payment method object if there is a selected method;
undefined if otherwise.

___

###  getSelectedShippingOption

▸ **getSelectedShippingOption**(): *[ShippingOption](shippingoption.md) | undefined*

Gets the selected shipping option for the current checkout.

<<<<<<< HEAD
<<<<<<< HEAD
**Returns:** *[ShippingOption](shippingoption.md) | undefined*
=======
Gets the selected shipping option for the current checkout.

=======
>>>>>>> build
**Returns:**  [ShippingOption](shippingoption.md) &#124; `undefined`
>>>>>>> build

The shipping option object if there is a selected option,
otherwise undefined.

___

###  getShippingAddress

▸ **getShippingAddress**(): *[Address](address.md) | undefined*

<<<<<<< HEAD
Gets the shipping address of the current checkout.

<<<<<<< HEAD
If the address is partially complete, it may not have shipping options
associated with it.

**Returns:** *[Address](address.md) | undefined*
=======
If the address is partially complete, it may not have shipping options associated with it.

=======
>>>>>>> build
**Returns:**  [Address](address.md) &#124; `undefined`
>>>>>>> build

The shipping address object if it is loaded, otherwise
undefined.

___

###  getShippingAddressFields

▸ **getShippingAddressFields**(`countryCode`: string): *[FormField](formfield.md)[]*

Gets a set of form fields that should be presented to customers in order
to capture their shipping address for a specific country.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`countryCode` | string | A 2-letter country code (ISO 3166-1 alpha-2). |

**Returns:** *[FormField](formfield.md)[]*

The set of shipping address form fields if it is loaded,
otherwise undefined.

___

###  getShippingCountries

▸ **getShippingCountries**(): *[Country](country.md)[] | undefined*

Gets a list of countries available for shipping.

<<<<<<< HEAD
<<<<<<< HEAD
**Returns:** *[Country](country.md)[] | undefined*
=======
Gets a list of countries available for shipping.

=======
>>>>>>> build
**Returns:**  [Country](country.md)[] &#124; `undefined`
>>>>>>> build

The list of countries if it is loaded, otherwise undefined.

___

###  getShippingOptions

▸ **getShippingOptions**(): *[ShippingOption](shippingoption.md)[] | undefined*

<<<<<<< HEAD
Gets a list of shipping options available for the shipping address.

<<<<<<< HEAD
If there is no shipping address assigned to the current checkout, the
list of shipping options will be empty.

**Returns:** *[ShippingOption](shippingoption.md)[] | undefined*
=======
Gets a list of shipping options available for the shipping address.

If there is no shipping address assigned to the current checkout, the list of shipping options will be empty.

=======
>>>>>>> build
**Returns:**  [ShippingOption](shippingoption.md)[] &#124; `undefined`
>>>>>>> build

The list of shipping options if any, otherwise undefined.

___

###  getSignInEmail

▸ **getSignInEmail**(): *[SignInEmail](signinemail.md) | undefined*

<<<<<<< HEAD
Gets the sign-in email.

<<<<<<< HEAD
**Returns:** *[SignInEmail](signinemail.md) | undefined*
=======
Gets the sign-in email.

=======
>>>>>>> build
**Returns:**  [SignInEmail](signinemail.md) &#124; `undefined`
>>>>>>> build

The sign-in email object if sent, otherwise undefined

___

###  isPaymentDataRequired

▸ **isPaymentDataRequired**(`useStoreCredit?`: undefined | false | true): *boolean*

Checks if payment data is required or not.

If payment data is required, customers should be prompted to enter their
payment details.

```js
if (state.checkout.isPaymentDataRequired()) {
    // Render payment form
} else {
    // Render "Payment is not required for this order" message
}
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`useStoreCredit?` | undefined &#124; false &#124; true | If true, check whether payment data is required with store credit applied; otherwise, check without store credit. |

**Returns:** *boolean*

True if payment data is required, otherwise false.

___

###  isPaymentDataSubmitted

▸ **isPaymentDataSubmitted**(`methodId`: string, `gatewayId?`: undefined | string): *boolean*

<<<<<<< HEAD
Checks if payment data is submitted or not.
<<<<<<< HEAD
=======

If payment data is already submitted using a payment method, customers should not be prompted to enter their payment details again.

=======
>>>>>>> build
**Parameters:**
>>>>>>> build

If payment data is already submitted using a payment method, customers
should not be prompted to enter their payment details again.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`methodId` | string | The identifier of the payment method. |
`gatewayId?` | undefined &#124; string | The identifier of a payment provider providing the payment method. |

**Returns:** *boolean*

True if payment data is submitted, otherwise false.

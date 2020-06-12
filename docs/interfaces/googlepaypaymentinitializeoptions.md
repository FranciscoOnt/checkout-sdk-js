[@bigcommerce/checkout-sdk](../README.md) › [GooglePayPaymentInitializeOptions](googlepaypaymentinitializeoptions.md)

# Interface: GooglePayPaymentInitializeOptions

A set of options that are required to initialize the GooglePay payment method

If the customer chooses to pay with GooglePay, they will be asked to
enter their payment details via a modal. You can hook into events emitted by
the modal by providing the callbacks listed below.

A set of options that are required to initialize the GooglePay payment method

If the customer chooses to pay with GooglePay, they will be asked to enter their payment details via a modal. You can hook into events emitted by the modal by providing the callbacks listed below.

## Hierarchy

* **GooglePayPaymentInitializeOptions**

## Index

### Properties

* [walletButton](googlepaypaymentinitializeoptions.md#optional-walletbutton)

### Methods

* [onError](googlepaypaymentinitializeoptions.md#optional-onerror)
* [onPaymentSelect](googlepaypaymentinitializeoptions.md#optional-onpaymentselect)

## Properties

### `Optional` walletButton

• **walletButton**? : *undefined | string*

<<<<<<< HEAD
This walletButton is used to set an event listener, provide an element ID if you want
users to be able to launch the GooglePay wallet modal by clicking on a button.
It should be an HTML element.
=======
**● walletButton**: * `undefined` &#124; `string`
*

This walletButton is used to set an event listener, provide an element ID if you want users to be able to launch the GooglePay wallet modal by clicking on a button. It should be an HTML element.

___
>>>>>>> build

## Methods

### `Optional` onError

▸ **onError**(`error`: [Error](amazonpaywidgeterror.md#error)): *void*

A callback that gets called when GooglePay fails to initialize or
selects a payment option.

A callback that gets called when GooglePay fails to initialize or selects a payment option.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`error` | [Error](amazonpaywidgeterror.md#error) | The error object describing the failure.  |

**Returns:** *void*

___

### `Optional` onPaymentSelect

<<<<<<< HEAD
▸ **onPaymentSelect**(): *void*
=======
A callback that gets called when the customer selects a payment option.

**Returns:** `void`
>>>>>>> build

A callback that gets called when the customer selects a payment option.

**Returns:** *void*

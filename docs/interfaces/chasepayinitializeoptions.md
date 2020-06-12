[@bigcommerce/checkout-sdk](../README.md) › [ChasePayInitializeOptions](chasepayinitializeoptions.md)

# Interface: ChasePayInitializeOptions

## Hierarchy

* **ChasePayInitializeOptions**

## Index

### Properties

* [logoContainer](chasepayinitializeoptions.md#optional-logocontainer)
* [walletButton](chasepayinitializeoptions.md#optional-walletbutton)

### Methods

* [onCancel](chasepayinitializeoptions.md#optional-oncancel)
* [onPaymentSelect](chasepayinitializeoptions.md#optional-onpaymentselect)

## Properties

### `Optional` logoContainer

• **logoContainer**? : *undefined | string*

This container is used to host the chasepay branding logo.
It should be an HTML element.

___

### `Optional` walletButton

• **walletButton**? : *undefined | string*

<<<<<<< HEAD
<<<<<<< HEAD
This walletButton is used to set an event listener, provide an element ID if you want
users to be able to launch the ChasePay wallet modal by clicking on a button.
It should be an HTML element.
=======
This walletButton is used to set an event listener, provide an element ID if you want users to be able to launch the ChasePay wallet modal by clicking on a button. It should be an HTML element.

=======
>>>>>>> build
___
>>>>>>> build

## Methods

### `Optional` onCancel

▸ **onCancel**(): *void*

A callback that gets called when the customer cancels their payment selection.

<<<<<<< HEAD
<<<<<<< HEAD
**Returns:** *void*
=======
A callback that gets called when the customer cancels their payment selection.

=======
>>>>>>> build
**Returns:** `void`
>>>>>>> build

___

### `Optional` onPaymentSelect

▸ **onPaymentSelect**(): *void*

<<<<<<< HEAD
A callback that gets called when the customer selects a payment option.
<<<<<<< HEAD
=======

=======
>>>>>>> build
**Returns:** `void`

___
>>>>>>> build

**Returns:** *void*

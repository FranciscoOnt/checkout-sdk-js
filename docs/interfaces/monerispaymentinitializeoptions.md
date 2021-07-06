[@bigcommerce/checkout-sdk](../README.md) › [MonerisPaymentInitializeOptions](monerispaymentinitializeoptions.md)

# Interface: MonerisPaymentInitializeOptions

A set of options that are required to initialize the Moneris payment method.

Once Moneris payment is initialized, a credit card payment form is provided by the
payment provider as an IFrame, it will be inserted into the current page. These
options provide a location and styling for the payment form.

```js
service.initializePayment({
     methodId: 'moneris',
     moneris: {
         containerId: 'container',
         style : {
             cssBody: 'background:white;';
             cssTextbox: 'border-width:2px;';
             cssTextboxPan: 'width:140px;';
             cssTextboxExpiry: 'width:40px;';
             csstexboxCvd: 'width:40px';
         }
     }
});
```

## Hierarchy

* **MonerisPaymentInitializeOptions**

## Index

### Properties

* [containerId](monerispaymentinitializeoptions.md#containerid)
* [form](monerispaymentinitializeoptions.md#optional-form)
* [style](monerispaymentinitializeoptions.md#optional-style)

## Properties

###  containerId

• **containerId**: *string*

The ID of a container where the Moneris iframe component should be mounted

___

### `Optional` form

• **form**? : *[HostedFormOptions](hostedformoptions.md)*

Hosted Form Validation Options

___

### `Optional` style

• **style**? : *[MonerisStylingProps](monerisstylingprops.md)*

The styling props to apply to the iframe component

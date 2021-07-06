[@bigcommerce/checkout-sdk](../README.md) › [MonerisStylingProps](monerisstylingprops.md)

# Interface: MonerisStylingProps

A set of stringified CSS to apply to Moneris' IFrame fields.
CSS attributes should be converted to string.
Please note that ClassNames are not supported.

IE:
```js
{
     cssBody: 'background:white;';
     cssTextbox: 'border-width:2px;';
     cssTextboxPan: 'width:140px;';
     cssTextboxExpiry: 'width:40px;';
     csstexboxCvd: 'width:40px;';
}
```

When using several attributes use semicolon to separate each one.
IE: 'background:white;width:40px;'

## Hierarchy

* **MonerisStylingProps**

## Index

### Properties

* [cssBody](monerisstylingprops.md#optional-cssbody)
* [cssTexboxCvd](monerisstylingprops.md#optional-csstexboxcvd)
* [cssTextbox](monerisstylingprops.md#optional-csstextbox)
* [cssTextboxExpiry](monerisstylingprops.md#optional-csstextboxexpiry)
* [cssTextboxPan](monerisstylingprops.md#optional-csstextboxpan)

## Properties

### `Optional` cssBody

• **cssBody**? : *undefined | string*

Stringified CSS to apply to the body of the IFrame.

___

### `Optional` cssTexboxCvd

• **cssTexboxCvd**? : *undefined | string*

Stringified CSS to apply to the card's CVV field.

___

### `Optional` cssTextbox

• **cssTextbox**? : *undefined | string*

Stringified CSS to apply to each of input fields.

___

### `Optional` cssTextboxExpiry

• **cssTextboxExpiry**? : *undefined | string*

Stringified CSS to apply to the card's expiry field.

___

### `Optional` cssTextboxPan

• **cssTextboxPan**? : *undefined | string*

Stringified CSS to apply to the card's number field.

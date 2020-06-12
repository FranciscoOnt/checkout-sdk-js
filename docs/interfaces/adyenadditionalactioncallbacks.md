[@bigcommerce/checkout-sdk](../README.md) › [AdyenAdditionalActionCallbacks](adyenadditionalactioncallbacks.md)

# Interface: AdyenAdditionalActionCallbacks

## Hierarchy

* **AdyenAdditionalActionCallbacks**

  ↳ [AdyenAdditionalActionOptions](adyenadditionalactionoptions.md)

  ↳ [AdyenThreeDS2Options](adyenthreeds2options.md)

## Index

### Methods

* [onBeforeLoad](adyenadditionalactioncallbacks.md#optional-onbeforeload)
* [onComplete](adyenadditionalactioncallbacks.md#optional-oncomplete)
* [onLoad](adyenadditionalactioncallbacks.md#optional-onload)

## Methods

### `Optional` onBeforeLoad

▸ **onBeforeLoad**(`shopperInteraction?`: undefined | false | true): *void*

A callback that gets called before adyen component is loaded

**Parameters:**

Name | Type |
------ | ------ |
`shopperInteraction?` | undefined &#124; false &#124; true |

**Returns:** *void*

___

### `Optional` onComplete

▸ **onComplete**(): *void*

<<<<<<< HEAD
<<<<<<< HEAD
A callback that gets called when adyen component verification
is completed
=======
A callback that gets called when adyen component verification is completed

=======
>>>>>>> build
**Returns:** `void`
>>>>>>> build

**Returns:** *void*

___

### `Optional` onLoad

<<<<<<< HEAD
<<<<<<< HEAD
▸ **onLoad**(`cancel?`: undefined | function): *void*
=======
A callback that gets called when adyen component is loaded

=======
>>>>>>> build
**Parameters:**
>>>>>>> build

A callback that gets called when adyen component is loaded

**Parameters:**

Name | Type |
------ | ------ |
`cancel?` | undefined &#124; function |

**Returns:** *void*

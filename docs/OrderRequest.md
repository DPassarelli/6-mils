# OrderRequest

An OrderRequest message is used to submit a purchase order to a supplier (or vendor). This can be done to fulfill the items previously selected in a PunchOut session, for example. Instances of this class can be used to construct the necessary XML, send it to the supplier's e-commerce site, and receive the XML response.


## General Notes

Optional values are indicated by a `?` after the expected data type. If all of the keys are optional, then the parameter is as well (meaning, there is no need to pass an empty literal object).

In this document, "Corresponding cXML Element" refers to the element that is referenced when the method or property is called. All of the indicated hierarchies start at the root `<cXML>` element.


## Constructor

Each instance of `OrderRequest` must be constructed with a single parameter, which is a plain object. This object must at least contain an `orderId` property with a non-blank value, e.g.:

```
const cxml = require('6-mils')
const orderReq = new cxml.OrderRequest({ orderId: 'ABC123' })
```

#### Parameters

| Name | Type | Notes |
|------|------|-------|
| `options` | {Object} | A plain object, with one or more of the keys listed below. |

#### `options`

| Key | Type | Notes |
|-----|------|-------|
| `orderDate` | {Date?\|String?} | The date and time that the order was placed. If specified as a string, it must be in [ISO 8601 format](https://www.w3.org/TR/NOTE-datetime). If missing, the current date and time will be used by default. |
| `orderId` | {String} | Required. The identifier for the order that this cXML message represents. This is typically the purchase order (PO) number. |
| `payloadId` | {String?} | See below. |

**Notes for `payloadId`**

An optional value to insert into the `payloadID` attribute of the `<cXML>` (root) element. According to the cXML documentation, this should be:

> A unique number with respect to space and time, used for logging purposes to identify documents that might have been lost or had problems. This value should not change for retry attempts. The recommended implementation is: datetime.process id.random number@hostname

If this value is empty or missing, one will be created automatically with the hostname `unknown`.

If this value starts with `@`, then that will be used as the hostname. If it starts with any other printable character, then it will be used as the entire payload ID.

_Examples:_

| Code excerpt | Generated XML |
|--------------|---------------|
| `new OrderRequest()` or `new OrderRequest({ payloadId: null })` | `<cXML payloadID="1585421431623.6245.0VYD2K626M@unknown"...` |
| `new OrderRequest({ payloadId: '@example.com' })` | `<cXML payloadID="1585421431623.6245.0VYD2K626M@example.com"...` |
| `new OrderRequest({ payloadId: '12345.09876.foobar@example.com' })` | `<cXML payloadID="12345.09876.foobar@example.com"...` |
| `new OrderRequest({ payloadId: '"></cXML>some malicious content' })` | `<cXML payloadID="&quot;&gt;&lt;/cXML&gt;some malicious content@unknown"...` |


## Properties

### `orderDate` {String}

The date and time that the order was placed. If not specified when constructing the instance, the value will be the current date and time at the moment of instantiation. Read-only.

#### Corresponding cXML Element

`<cXML>` → `<Request>` → `<OrderRequest>` → `<OrderRequestHeader>` (`orderDate` attribute)


### `orderId` {String}

The identifier for the order that this cXML message represents. This is typically the purchase order (PO) number. The value must be specified when creating new instances of this class. Read-only.

#### Corresponding cXML Element

`<cXML>` → `<Request>` → `<OrderRequest>` → `<OrderRequestHeader>` (`orderID` attribute)


### `payloadId` {String}

The unique identifier for this cXML message. Read-only.

#### Corresponding cXML Element

`<cXML>` (`payloadID` attribute)


### `timestamp` {String}

The date and time of the cXML transmission, which will be in [ISO 8601 format](https://www.w3.org/TR/NOTE-datetime). Read-only.

**This property will not have a value until the `submit()` method is called.**

#### Corresponding cXML Element

`<cXML>` (`timestamp` attribute)


### `version` {String}

The version of the cXML protocol used to generate the OrderRequest. This is specified in the referenced DTD. Read-only.


## Methods

Nearly all methods are [chainable](https://en.wikipedia.org/wiki/Method_chaining), which means that they return `this`. This is indicated by a ⛓ immediately after the method name. Otherwise, the type of returned value is indicated.

### `addItem`

Adds a line item to the purchase order. Typically, the values for each item (such as unit of measurement, supplier part id, name, etc) are the same as was provided in a previously-received PunchOutOrderMessage.

**Line item numbers are assigned sequentially in the same order that items are added programmatically (either through this method or `addItems`).**

#### Parameters

| Name | Type | Notes |
|------|------|-------|
| `item` | {Object} | A plain object having the keys listed below. |

#### `item`

| Key | Type | Notes |
|-----|------|-------|
| `classification` | {Object?} | See notes below. |
| `currency` | {String?} | The ISO 4217 currency code for `unitPrice`. The default value is `USD`. |
| `name` | {String} | The name of the item. |
| `quantity` | {Number} | The number of units being ordered. |
| `supplierPartId` | {String} | The supplier's part ID for this item. |
| `supplierPartAuxId` | {String?} | An additional identifier that may be used by the supplier to encode a custom configuration for this item. Optional. |
| `unitPrice` | {Number} | The price for each unit of this item. |
| `uom` | {String} | The unit of measure for this item, according to the [UN/CEFACT Unit of Measure Common Codes](https://www.unece.org/cefact/codesfortrade/codes_index.html). |

#### `classification`

This value, if specified, must be a plain object. Each key will be used to populate the `domain` attribute of a `<Classification>` child element, and the value will be used for the text of the element. For example,

`classification: { UNSPSC: '5136030000' }` → `<Classification domain="UNSPSC">5136030000</Classification>`

#### Corresponding cXML Element

`<cXML>` → `<Request>` → `<OrderRequest>` → `<ItemOut>`


### `addItems` ⛓

The same as `addItem`, except that this method accepts an array of items and is chainable.

#### Parameters

| Name | Type | Notes |
|------|------|-------|
| `items` | {Array} | An array of plain objects, each one having the keys listed above. |


### `setBillingInfo` ⛓

Sets the bill-to address, payment card information (optional), and tax (also optional).

#### Parameters

| Name | Type | Notes |
|------|------|-------|
| `address` | {Object} | A plain object, with the keys listed below. |
| `pcard` | {Object} | A plain object with keys `number` and `expiration`. 



### `setBuyerInfo` ⛓

Sets the credentials for the purchaser's organization (the one that the POSReq is being sent from).

#### Parameters

| Name | Type | Notes |
|------|------|-------|
| `options` | {Object?} | A plain object, with one or more of the keys listed below. |

#### `options`

| Key | Type | Notes |
|-----|------|-------|
| `domain` | {String?} | The value to insert into the `domain` attribute of the `<Credential>` element. |
| `id` | {String?} | The value to insert into the `<Identity>` child element. |

**Note:** `null` values will be converted into empty strings. Missing values are ignored, and if not otherwise specified, default to empty strings.

#### Corresponding cXML Element

`<cXML>` → `<Header>` → `<From>`


### `setExtrinsic`  ⛓

Sets the collection of `Extrinsic` elements. Omit the parameter value (or leave it as an empty object) in order to clear the collection.

#### Parameters

| Name | Type | Notes |
|------|------|-------|
| `hash` | {Object?} | A plain object. For each key, a separate `<Extrinsic>` element will be created, with the name of the key put into the `name` attribute, and the value put into the text of the element itself. |

_Example:_

| Code excerpt | Generated XML |
|--------------|---------------|
| `setExtrinsic({ first: 'John', last: 'Doe' })` | `<Extrinsic name="first">John</Extrinsic><Extrinsic name="last">Doe</Extrinsic>` |

#### Corresponding cXML Element

`<cXML>` → `<Request>` → `<OrderRequest>` → `<OrderRequestHeader>` → `<Extrinsic>`


### `setSenderInfo` ⛓

Sets the credentials for the sending entity (either `6-mils` or a network relay).

#### Parameters

| Name | Type | Notes |
|------|------|-------|
| `options` | {Object?} | A plain object, with one or more of the keys listed below. |

#### `options`

| Key | Type | Notes |
|-----|------|-------|
| `domain` | {String?} | The value to insert into the `domain` attribute of the `<Credential>` element. |
| `id` | {String?} | The value to insert into the `<Identity>` child element. |
| `secret` | {String?} | The value to insert into the `<SharedSecret>` element. |
| `ua` | {String?} | The value to insert into the `<UserAgent>` element. If not specified, the default value is the name and version number of this module. |

**Note:** `null` values will be converted into empty strings. Missing values are ignored, and if not otherwise specified, default to empty strings.

#### Corresponding cXML Element

`<cXML>` → `<Header>` → `<Sender>`


### `setShippingInfo` ⛓
address and ship method


### `setSupplierInfo` ⛓

Sets the credentials for the supplier's organization (the one that the POSReq is being sent to).

#### Parameters

| Name | Type | Notes |
|------|------|-------|
| `options` | {Object?} | A plain object, with one or more of the keys listed below. |

#### `options`

| Key | Type | Notes |
|-----|------|-------|
| `domain` | {String?} | The value to insert into the `domain` attribute of the `<Credential>` element. |
| `id` | {String?} | The value to insert into the `<Identity>` child element. |

**Note:** `null` values will be converted into empty strings. Missing values are ignored, and if not otherwise specified, default to empty strings.

#### Corresponding cXML Element

`<cXML>` → `<Header>` → `<To>`


### `submit` {Promise}

Initiates the transmission of the OrderRequest message to the supplier, at the specified URL.

#### Parameters

| Name | Type | Notes |
|------|------|-------|
| `url` | {String} | A valid URL that can receive the OrderRequest. |

 The return value is an instance of `Promise`, which if successful, will resolve to an new instance of `OrderResponse`. Please refer to the documentation for that object type for more information.

**The promise will only be rejected if there is a problem with the underlying HTTP transmission. The supplier may return a cXML message that indicates an error with the OrderRequest, or with their system, but this can only be determined by checking the properties of the returned `OrderResponse`.**


### `toString` {String}

Returns the raw cXML of the underlying OrderRequest message. User-provided values containing control characters will be escaped.

#### Parameters

| Name | Type | Notes |
|------|------|-------|
| `options` | {Object?} | A plain object, with one or more of the keys listed below. |

#### `options`

| Key | Type | Notes |
|-----|------|-------|
| `format` | {Boolean?} | If `true`, then the cXML will be formatted with line breaks and indentation to make it human-readable. |

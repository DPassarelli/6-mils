# OrderRequest

An OrderRequest message is used to submit a purchase order to a supplier (or vendor). This can be done to fulfill the items previously selected in a PunchOut session, for example. Instances of this class can be used to construct the necessary XML, send it to the supplier's e-commerce site, and receive the XML response.


## General Notes

Optional values are indicated by a `?` after the expected data type. If all of the keys are optional, then the parameter is as well (meaning, there is no need to pass an empty literal object).

In this document, "Corresponding cXML Element" refers to the element that is referenced when the method or property is called. All of the indicated hierarchies start at the root `<cXML>` element.


## Constructor

Each instance of `OrderRequest` may be constructed without any arguments, e.g.:

```
const cxml = require('6-mils')
const orderReq = new cxml.OrderRequest()
```

##### Parameters

| Name | Type | Notes |
|------|------|-------|
| `options` | {Object?} | A plain object, with one or more of the keys listed below. |


##### Options

| Key | Type | Notes |
|-----|------|-------|
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


## Methods

Nearly all methods are [chainable](https://en.wikipedia.org/wiki/Method_chaining), which means that they return `this`. This is indicated by a ⛓ immediately after the method name. Otherwise, the type of returned value is indicated.

##### Parameters


### `submit` {Promise}

Initiates the transmission of the OrderRequest message to the supplier, at the specified URL.

##### Parameters

| Name | Type | Notes |
|------|------|-------|
| `url` | {String} | A valid URL that can receive the OrderRequest. |

 The return value is an instance of `Promise`, which if successful, will resolve to an new instance of `OrderResponse`. Please refer to the documentation for that object type for more information.

**Note: the promise will only be rejected if there is a problem with the underlying HTTP transmission. The supplier may return a cXML message that indicates an error with the POSReq, or with their system, but this can only be determined by checking the properties of the returned `PunchOutSetupResponse`.**


### `toString` {String}

Returns the raw cXML of the underlying OrderRequest message. User-provided values containing control characters will be escaped.

##### Parameters

| Name | Type | Notes |
|------|------|-------|
| `options` | {Object?} | A plain object, with one or more of the keys listed below. |

##### Options

| Key | Type | Notes |
|-----|------|-------|
| `format` | {Boolean?} | If `true`, then the cXML will be formatted with line breaks and indentation to make it human-readable. |

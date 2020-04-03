# PunchOutSetupRequest (POSReq)

A PunchOutSetupRequest message must be transmitted to a supplier (or vendor) to initiate a PunchOut session. Instances of this class can be used to construct the necessary XML, send it to the supplier's e-commerce site, receive the XML response, and return the URL that the buyer should use to access the supplier's online catalog. 

## General Notes

Optional values are indicated by a `?` after the expected data type. If all of the keys are optional, then the parameter is as well (meaning, there is no need to pass an empty literal object).

In this document, "Corresponding cXML Element" refers to the element that is referenced when the method or property is called. All of the indicated hierarchies start at the root `<cXML>` element.


## Constructor

Each instance of `PunchOutSetupRequest` may be constructed without any arguments, e.g.:

```
const cxml = require('6-mils')
const posreq = new cxml.PunchOutSetupRequest()
```

##### Parameters

| Name | Type | Notes |
|------|------|-------|
| `options` | {Object?} | A plain object, with one or more of the keys listed below. |


##### Options

| Key | Type | Notes |
|-----|------|-------|
| `payloadId` | {String?} | See below. |
| `buyerCookie` | {String?} | If provided, this will be inserted into the `<cXML>` → `<Request>` → `<PunchOutSetupRequest>` → `<BuyerCookie>` element. If empty or missing, a unique value will be automatically generated. This value can be retrieved via the read-only `buyerCookie` property. |

**Notes for `payloadId`**

An optional value to insert into the `payloadID` attribute of the `<cXML>` (root) element. According to the cXML documentation, this should be:

> A unique number with respect to space and time, used for logging purposes to identify documents that might have been lost or had problems. This value should not change for retry attempts. The recommended implementation is: datetime.process id.random number@hostname

If this value is empty or missing, one will be created automatically with the hostname `unknown`.

If this value starts with `@`, then that will be used as the hostname. If it starts with any other printable character, then it will be used as the entire payload ID.

_Examples:_

| Code excerpt | Generated XML |
|--------------|---------------|
| `new PunchOutSetupRequest()` or `new PunchOutSetupRequest({ payloadId: null })` | `<cXML payloadID="1585421431623.6245.0VYD2K626M@unknown"...` |
| `new PunchOutSetupRequest({ payloadId: '@example.com' })` | `<cXML payloadID="1585421431623.6245.0VYD2K626M@example.com"...` |
| `new PunchOutSetupRequest({ payloadId: '12345.09876.foobar@example.com' })` | `<cXML payloadID="12345.09876.foobar@example.com"...` |
| `new PunchOutSetupRequest({ payloadId: '"></cXML>some malicious content' })` | `<cXML payloadID="&quot;&gt;&lt;/cXML&gt;some malicious content@unknown"...` |


## Properties

### `buyerCookie` {String}

The unique identifier for this PunchOut session. This value will be used later on by the supplier when sending back the corresponding PunchOutOrderMessage. Read-only.

##### Corresponding cXML Element

`<cXML>` → `<Request>` → `<PunchOutSetupRequest>` → `<BuyerCookie>`


### `payloadId` {String}

The unique identifier for this cXML message. Read-only.

##### Corresponding cXML Element

`<cXML>` (`payloadID` attribute)


## Methods

Nearly all methods are [chainable](https://en.wikipedia.org/wiki/Method_chaining), which means that they return `this`. This is indicated by a ⛓ immediately after the method name. Otherwise, the type of returned value is indicated.


### `setBuyerInfo` ⛓

Sets the credentials for the purchaser's organization (the one that the POSReq is being sent from).

##### Parameters

| Name | Type | Notes |
|------|------|-------|
| `options` | {Object?} | A plain object, with one or more of the keys listed below. |

##### Options

| Key | Type | Notes |
|-----|------|-------|
| `domain` | {String?} | The value to insert into the `domain` attribute of the `<Credential>` element. |
| `id` | {String?} | The value to insert into the `<Identity>` child element. |

**Note:** `null` values will be converted into empty strings. Missing values are ignored, and if not otherwise specified, default to empty strings.

##### Corresponding cXML Element

`<cXML>` → `<Header>` → `<From>`


### `setExtrinsic`  ⛓

Sets the collection of `Extrinsic` elements. Omit the parameter value (or leave it as an empty object) in order to clear the collection.

##### Parameters

| Name | Type | Notes |
|------|------|-------|
| `dict` | {Object?} | A plain object. For each key, a separate `<Extrinsic>` element will be created, with the name of the key put into the `name` attribute, and the value put into the text of the element itself. |

_Example:_

| Code excerpt | Generated XML |
|--------------|---------------|
| `setExtrinsic({ first: 'John', last: 'Doe' })` | `<Extrinsic name="first">John</Extrinsic><Extrinsic name="last">Doe</Extrinsic>` |

##### Corresponding cXML Element

`<cXML>` → `<Request>` → `<PunchOutSetupRequest>` → `<Extrinsic>`


### `setPostbackUrl` ⛓

Sets the address that the buyer's web browser (along with the shopping cart data) will be redirected to after they "checkout" (meaning, complete their shopping) from the supplier's punchout site.

##### Parameters

| Name | Type | Notes |
|------|------|-------|
| `url` | {String} | A valid URL that the user will be redirected to after completing the PunchOut session. |

##### Corresponding cXML Element

`<cXML>` → `<Request>` → `<PunchOutSetupRequest>` → `<BrowserFormPost>` → `<URL>`


### `setSenderInfo` ⛓

Sets the credentials for the sending entity (either `6-mils` or a network relay).

##### Parameters

| Name | Type | Notes |
|------|------|-------|
| `options` | {Object?} | A plain object, with one or more of the keys listed below. |

##### Options

| Key | Type | Notes |
|-----|------|-------|
| `domain` | {String?} | The value to insert into the `domain` attribute of the `<Credential>` element. |
| `id` | {String?} | The value to insert into the `<Identity>` child element. |
| `secret` | {String?} | The value to insert into the `<SharedSecret>` element. |
| `ua` | {String?} | The value to insert into the `<UserAgent>` element. If not specified, the default value is the name and version number of this module. |

**Note:** `null` values will be converted into empty strings. Missing values are ignored, and if not otherwise specified, default to empty strings.

##### Corresponding cXML Element

`<cXML>` → `<Header>` → `<Sender>`


### `setSupplierInfo` ⛓

Sets the credentials for the supplier's organization (the one that the POSReq is being sent to).

##### Parameters

| Name | Type | Notes |
|------|------|-------|
| `options` | {Object?} | A plain object, with one or more of the keys listed below. |

##### Options

| Key | Type | Notes |
|-----|------|-------|
| `domain` | {String?} | The value to insert into the `domain` attribute of the `<Credential>` element. |
| `id` | {String?} | The value to insert into the `<Identity>` child element. |

**Note:** `null` values will be converted into empty strings. Missing values are ignored, and if not otherwise specified, default to empty strings.

##### Corresponding cXML Element

`<cXML>` → `<Header>` → `<To>`


### `submit` {Promise}

Initiates the transmission of the PunchOutSetupRequest message to the supplier, at the specified URL.

##### Parameters

| Name | Type | Notes |
|------|------|-------|
| `url` | {String} | A valid URL that can receive the POSReq. |

 The return value is an instance of `Promise`, which if successful, will resolve to an new instance of `PunchOutSetupResponse`. Please refer to the documentation for that object type for more information.

**Note: the promise will only be rejected if there is a problem with the underlying HTTP transmission. The supplier may return a cXML message that indicates an error with the POSReq, or with their system, but this can only be determined by checking the properties of the returned `PunchOutSetupResponse`.**


### `toString` {String}

Returns the raw cXML of the underlying POSReq message. User-provided values containing control characters will be escaped.

##### Parameters

| Name | Type | Notes |
|------|------|-------|
| `options` | {Object?} | A plain object, with one or more of the keys listed below. |

##### Options

| Key | Type | Notes |
|-----|------|-------|
| `format` | {Boolean?} | If `true`, then the cXML will be formatted with line breaks and indentation to make it human-readable. |

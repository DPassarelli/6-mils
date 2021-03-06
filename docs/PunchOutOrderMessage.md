# PunchOutOrderMessage

A PunchOutOrderMessage message is received back from the supplier once the buyer has completed shopping in a PunchOut session. Instances of this class can be used to parse the received cXML, and make the data available as native JavaScript types. 


## Constructor

Each instance of `PunchOutOrderMessage` must be constructed with a single argument that is well-formed XML, and adhere to a known-version of the cXML DTD.


#### Parameters

| Name | Type | Notes |
|------|------|-------|
| `cxml` | {String} | A well-formed XML document that adheres to a known-version of the cXML DTD for `PunchOutOrderMessage`s. |


## Properties

### `buyerCookie` {String}

The unique identifier for this PunchOut session. This value is used to correlate this PunchOutOrderMessage with the initiating PunchOutSetupRequest. Read-only.

#### Corresponding cXML Element

`<cXML>` → `<Message>` → `<PunchOutOrderMessage>` → `<BuyerCookie>`


### `buyerInfo` {Object}

The credentials of the purchaser's organization (the one that the PunchOutOrderMessage is being sent to). Returns a dictionary containing the following keys:

| Name | Type | Notes |
|------|------|-------|
| `domain` | {String} | The value of the `domain` attribute in the `<Credential>` element. |
| `id` | {String} | The contents of the `<Identity>` child element. |

#### Corresponding cXML Element

`<cXML>` → `<Header>` → `<To>`


### `items` {Array}

The list of all the items that were in the buyer's shopping cart when they "checked out" from the supplier's PunchOut site (see note below). **If the PunchOut session is ended with nothing in the buyer's shopping cart, then this list will be empty (`items.length === 0`).**

Each entry is a dictionary containing the following keys:

| Name | Type | Notes |
|------|------|-------|
| `classification` | {Object} | See notes below. |
| `currency` | {String} | The ISO 4217 currency code for `unitPrice`. |
| `description` | {String} | The contents of the `<ItemIn>` → `<ItemDetail>` → `<Description>` child element (not including any `<ShortName>` child element, if present. |
| `name` | {String} | If the `<Description>` element contains a `<ShortName>` child, this will contain the value of that child element. Otherwise, it will be the same value as `description`. |
| `quantity` | {Number} | The number of units ordered. |
| `supplierPartId` | {String} | The supplier's part ID for this item. |
| `supplierPartAuxId` | {String} | An additional identifier that may be used by the supplier to encode a custom configuration for this item. If the `<SupplierPartAuxiliaryID>` child element is missing, then this will be an empty string. |
| `unitPrice` | {Number} | The price for each unit of this item. |
| `uom` | {String} | The unit of measure for this item, according to the [UN/CEFACT Unit of Measure Common Codes](https://www.unece.org/cefact/codesfortrade/codes_index.html). |

#### `classification`

If the `<ItemIn>` element contains one or more `<Classification>` child elements, they will be parsed and entered into this dictionary of key-value pairs. The value of the `domain` attribute will be the key, and the contents of the element will be the value. For example,

`<Classification domain="UNSPSC">5136030000</Classification>` → `{ UNSPSC: '5136030000' }`

#### Corresponding cXML Element

`<cXML>` → `<Message>` → `<PunchOutOrderMessage>` → `<ItemIn>`


### `payloadId` {String}

The unique identifier for this cXML message. Read-only.

#### Corresponding cXML Element

`<cXML>` (`payloadID` attribute)


### `senderInfo` {Object}

The credentials for the sending entity. Returns a dictionary containing the following keys:

| Name | Type | Notes |
|------|------|-------|
| `domain` | {String} | The value of the `domain` attribute in the `<Credential>` element. |
| `id` | {String} | The contents of the `<Identity>` child element. |
| `ua` | {String} | The contents of the `<UserAgent>` element. |

#### Corresponding cXML Element

`<cXML>` → `<Header>` → `<Sender>`


### `supplierInfo` {Object}

The credentials of the supplier's organization (the one that the PunchOutOrderMessage is being sent from). Returns a dictionary containing the following keys:

| Name | Type | Notes |
|------|------|-------|
| `domain` | {String} | The value of the `domain` attribute in the `<Credential>` element. |
| `id` | {String} | The contents of the `<Identity>` child element. |

#### Corresponding cXML Element

`<cXML>` → `<Header>` → `<From>`


### `timestamp` {String}

The date and time of the cXML transmission, which is expected to be in [ISO 8601 format](https://www.w3.org/TR/NOTE-datetime). Read-only.

#### Corresponding cXML Element

`<cXML>` (`timestamp` attribute)


### `total` {Object}

The total amount (of units and costs) from the shopping cart. Returns a dictionary with the following keys:

| Name | Type | Notes |
|------|------|-------|
| `cost` | {Number} | The total cost of the entire order (based on the value in the `<Money>` element, not calculated from the entries in `items`). |
| `currency` | {String} | The value of the `currency` attribute in the `<Money>` element. If there are no items in the order, then this will be an empty string. |
| `items` | {Number} | The number of items in the order. This value will always be the same as `items.length`. |
| `units` | {Number} | The total number of all units for all items in the order. |

#### Corresponding cXML Element

`<cXML>` → `<Message>` → `<PunchOutOrderMessageHeader>` → `<Total>` → `<Money>`


### `version` {String}

The version of the cXML protocol used to generate the PunchOutOrderMessage. This is extracted from the referenced DTD. Read-only.


## Methods

### `query(xpath)` {String}

| Parameter | Type | Notes |
|-----------|------|-------|
| `xpath`   | {String} | A valid XPath expression. |

This method will return the string value of the data pointed to by the given XPath expression. If the XPath expression does not resolve, then an empty string will be returned. An invalid XPath expression will cause the method to throw an `Error`.

**At this time, `query()` only returns string values.** Keep this in mind if you use an XPath expression that could return multiple nodes, or numeric values, etc. Everything will be coerced into a single string value.

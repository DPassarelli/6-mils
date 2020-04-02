# PunchOutOrderMessage (POOM)

A PunchOutOrderMessage message is received back from the supplier once the buyer has completed shopping in a PunchOut session. Instances of this class can be used to parse the received cXML, and make the data available as native JavaScript types. 


## Constructor

Each instance of `PunchOutOrderMessage` must be constructed with a single argument that is well-formed XML, and adhere to a known-version of the cXML DTD.


##### Parameters

| Name | Type | Notes |
|------|------|-------|
| `cxml` | {String} | A well-formed XML document that adheres to a known-version of the cXML DTD for `PunchOutOrderMessage`s. |


## Properties

### `buyerCookie` {String}

Returns the contents of the `<cXML>` → `<Message>` → `<PunchOutOrderMessage>` → `<BuyerCookie>` element. Read-only.


### `from` {Object}

Returns a dictionary containing the following keys:

| Name | Type | Notes |
|------|------|-------|
| `domain` | {String} | The value of the `domain` attribute in the `<cXML>` → `<Header>` → `<From>` → `<Credential>` element. |
| `id` | {String} | The contents of the `<cXML>` → `<Header>` → `<From>` → `<Credential>` → `<Identity>` element. |


### `items` {Array}

Returns a list of all the items in the shopping cart (see note below). Each entry is a dictionary containing the following keys:

| Name | Type | Notes |
|------|------|-------|
| `classification` | {Object} | See notes below. |
| `currency` | {String} | The ISO 4217 currency code for `unitPrice`. |
| `description` | {String} | The contents of the `<ItemIn>` → `<ItemDetail>` → `<Description>` element (not including any `<ShortName>` child element, if present. |
| `name` | {String} | If the `<Description>` element contains a `<ShortName>` child, this will contain the value of that child element. Otherwise, it will be the same value as `description`. |
| `quantity` | {Number} | The number of units ordered. |
| `supplierPartId` | {String} | The supplier's part ID for this item. |
| `supplierPartAuxId` | {String} | An additional identifier that may be used by the supplier to encode a custom configuration for this item. If the `<SupplierPartAuxiliaryID>` element is missing, then this will be an empty string. |
| `unitPrice` | {Number} | The price for each unit of this item. |
| `uom` | {String} | The unit of measure for this item, according to the [UN/CEFACT Unit of Measure Common Codes](https://www.unece.org/cefact/codesfortrade/codes_index.html). |

##### `classification`

If the `<ItemIn>` element contains one or more `<Classification>` child elements, they will be parsed and entered into this dictionary of key-value pairs. The value of the `domain` attribute will be the key, and the contents of the element will be the value. For example,

`<Classification domain="UNSPSC">5136030000</Classification>` → `{ UNSPSC: '5136030000' }`

#### Notes

If the PunchOut session is ended with nothing in the buyer's shopping cart, then this list will be empty (`items.length === 0`).


### `payloadId` {String}

Returns the value of the `payloadID` attribute of the `<cXML>` (root) element. Read-only.


### `sender` {Object}

Returns a dictionary containing the following keys:

| Name | Type | Notes |
|------|------|-------|
| `domain` | {String} | The value of the `domain` attribute in the `<cXML>` → `<Header>` → `<Sender>` → `<Credential>` element. |
| `id` | {String} | The contents of the `<cXML>` → `<Header>` → `<Sender>` → `<Credential>` → `<Identity>` element. |
| `ua` | {String} | The contents of the `<cXML>` → `<Header>` → `<Sender>` → `<UserAgent>` element. |


### `timestamp` {String}

Returns the value of the `timestamp` attribute of the `<cXML>` (root) element. Read-only.


### `to` {Object}

Returns a dictionary containing the following keys:

| Name | Type | Notes |
|------|------|-------|
| `domain` | {String} | The value of the `domain` attribute in the `<cXML>` → `<Header>` → `<To>` → `<Credential>` element. |
| `id` | {String} | The contents of the `<cXML>` → `<Header>` → `<To>` → `<Credential>` → `<Identity>` element. |


### `total` {Object}

Returns a dictionary with the following keys:

| Name | Type | Notes |
|------|------|-------|
| `cost` | {Number} | The total cost of the entire order. Taken from `<PunchOutOrderMessageHeader>` → `<Total>` → `<Money>`. |
| `items` | {Number} | The number of items in the order. This value will always be the same as `items.length`. |
| `units` | {Number} | The total number of all units for all items in the order. |


### `version` {String}

The version of the cXML protocol used to generate the POOM. This is extracted from the referenced DTD. Read-only.

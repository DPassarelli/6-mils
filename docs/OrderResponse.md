# OrderResponse

A OrderResponse message will be returned after submitting an OrderRequest.

_This class is not intended to be instantiated by callers. Rather, new instances will be returned by the `submit` method of the `OrderRequest`  class._

## General Notes

All of the properties in this class are read-only.

In this document, "Corresponding cXML Element" refers to the element that is referenced when the property is called. All of the indicated hierarchies start at the root `<cXML>` element.

**It has been observed in practice that a successful response to an OrderRequest may be an empty HTTP message (meaning, there is no body) with a `200` status code.** In such cases, the OrderRequest will be assumed to have been accepted, and the properties of the `OrderResponse` will have the following values:

| Property | Value |
|----------|-------|
| `payloadId` | An automatically generated value, with the hostname `@6-mils` |
| `statusCode` | `200` |
| `statusText` | `success` |
| `timestamp` | The same value as the `Date` header in the HTTP response message. It will be converted to ISO 8601 format. |
| `version` | The same value as implemented by this library. |


## Properties

### `payloadId` {String}

The unique identifier for this cXML message. Read-only.

#### Corresponding cXML Element

`<cXML>` (`payloadID` attribute)


### `statusCode` {String}

The "Request Status Code" returned by the supplier. Although this is intended to follow the [HTTP status code model](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status), such implementation depends on the software vendor who created the cXML system that the supplier is using.

Generally speaking, the values `200` (OK) and `500` (Internal Server Error) are consistently implemented. However, other codes may or may not be implemented in the way other developers expect them to be. _Although this property is provided for completeness sake, we strongly encourage you **not** to rely on it for determining anything other than the basic success or failure of the OrderRequest._

#### Corresponding cXML Element

`<cXML>` → `<Response>` → `<Status>` (`code` attribute)


### `statusText` {String}

A "human-friendly" description of the request status. If the `code` attribute of the `<Status>` element is `200`, then the value of this property will always be `success`. Otherwise, it will be the text contained within the `<Status>` element (if present), or the text contained in the `text` attribute. Read-only.

#### Corresponding cXML Element

`<cXML>` → `<Response>` → `<Status>`


### `timestamp` {String}

The date and time of the cXML transmission, which is expected to be in [ISO 8601 format](https://www.w3.org/TR/NOTE-datetime). Read-only.

#### Corresponding cXML Element

`<cXML>` (`timestamp` attribute)


### `version` {String}

The version of the cXML protocol used to generate the OrderRequest. This is extracted from the referenced DTD. Read-only.

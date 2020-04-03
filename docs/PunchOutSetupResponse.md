# PunchOutSetupResponse (POSRes)

A PunchOutSetupResponse message will be returned after submitting a PunchOutSetupRequest.

_This class is not intended to be instantiated by callers. Rather, new instances will be returned by the `submit` method of the `PunchOutSetupRequest`  class._

## General Notes

All of the properties in this class are read-only.

In this document, "Corresponding cXML Element" refers to the element that is referenced when the property is called. All of the indicated hierarchies start at the root `<cXML>` element.


## Properties

### `payloadId` {String}

The unique identifier for this cXML message. Read-only.

##### Corresponding cXML Element

`<cXML>` (`payloadID` attribute)


### `statusCode` {String}

The "Request Status Code" returned by the supplier. Although this is intended to follow the [HTTP status code model](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status), such implementation depends on the software vendor who created the cXML system that the supplier is using.

Generally speaking, the values `200` (OK) and `500` (Internal Server Error) are consistently implemented. However, other codes may or may not be implemented in the way other developers expect them to be. _Although this property is provided for completeness sake, we strongly encourage you **not** to rely on it for determining anything other than the basic success or failure of the PunchOutSetupRequest._

##### Corresponding cXML Element

`<cXML>` → `<Response>` → `<Status>` (`code` attribute)


### `statusText` {String}

A "log-friendly" description of the request status. If the `code` attribute of the `<Status>` element is `200`, then the value of this property will always be `success`. Otherwise, it will be the text contained within the `<Status>` element (if present), or the text contained in the `text` attribute. Read-only.

##### Corresponding cXML Element

`<cXML>` → `<Response>` → `<Status>`


### `timestamp` {String}

The date and time of the cXML transmission, which is expected to be in [ISO 8601 format](https://www.w3.org/TR/NOTE-datetime). Read-only.

##### Corresponding cXML Element

`<cXML>` (`timestamp` attribute)


### `url` {String}

The web address that the buyer should use to begin shopping at the supplier's PunchOut site. Read-only.

##### Corresponding cXML Element

`<cXML>` → `<Response>` → `<PunchOutSetupResponse>` → `<StartPage>` → `<URL>`


### `version` {String}

The version of the cXML protocol used to generate the POSRes. This is extracted from the referenced DTD. Read-only.

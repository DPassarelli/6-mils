# PunchOutSetupResponse (POSRes)

A PunchOutSetupResponse message will be returned after submitting a PunchOutSetupRequest.

_This class is not intended to be instantiated by callers. Rather, new instances will be returned by the `submit` method of the `PunchOutSetupRequest`  class._

## General Notes

All of the properties in this class are read-only.


## Properties

### `payloadId` {String}

The value of the `payloadID` attribute of the `<cXML>` (root) element. Read-only.


### `statusCode` {String}

The value of the `code` attribute of the `<cXML>` → `<Response>` → `<Status>` element. Read-only.


### `statusText` {String}

If the `statusCode` is `200`, then the value of this property will be `success`. Otherwise, it will be the text contained within the `<Status>` element (if present), or the text contained in the `text` attribute. Read-only.


### `timestamp` {String}

The value of the `timestamp` attribute of the `<cXML>` (root) element, which is expected to be in [ISO 8601 format](https://www.w3.org/TR/NOTE-datetime). Read-only.


### `url` {String}

The value of the `<cXML>` → `<Response>` → `<PunchOutSetupResponse>` → `<StartPage>` → `<URL>` element. This is the web address that the client should be directed to in order to begin shopping. Read-only.


### `version` {String}

The version of the cXML protocol used to generate the POSRes. This is extracted from the referenced DTD. Read-only.

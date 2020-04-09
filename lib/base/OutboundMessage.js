const debug = require('debug')('6-mils:OutboundMessage')
const process = require('process')
const uid = require('ulid').ulid

/**
 * A collection of private property values for each instance of this class.
 * @type {WeakMap}
 */
const _private = new WeakMap()

/**
 * Returns a new random payload identifier, sans host name. This value is
 * constructed according to the suggested implementation in the cXML Reference
 * Guide.
 *
 * @return {String}
 */
function getRandomPayloadIdentifier () {
  const time = (new Date()).getTime()
  const processId = process.ppid
  const uniqueId = uid().substring(16)

  return `${time}.${processId}.${uniqueId}`
}

class OutboundMessage {
  constructor (options) {
    options = options || {}

    debug('Constructing new message from options %o', options)

    options.payloadId = (options.payloadId || '')

    if (options.payloadId.length === 0) {
      options.payloadId = `${getRandomPayloadIdentifier()}@unknown`
    } else if (options.payloadId.toString().startsWith('@')) {
      options.payloadId = `${getRandomPayloadIdentifier()}${options.payloadId}`
    }

    // Populate the default values for each private property.
    _private.set(this, {
      cXmlVersion: '1.2.045',
      payloadId: options.payloadId
    })
  }

  get version () {
    return _private.get(this).cXmlVersion
  }

  get payloadId () {
    return _private.get(this).payloadId
  }
}

module.exports = OutboundMessage

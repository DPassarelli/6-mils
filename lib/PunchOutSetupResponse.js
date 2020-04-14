const InboundMessage = require('./base/InboundMessage.js')

/**
 * A collection of private property values for each instance of this class.
 * @type {WeakMap}
 */
const _private = new WeakMap()

class PunchOutSetupResponse extends InboundMessage {
  constructor (src) {
    super(src)
    _private.set(this, { url: this._getElementValue('URL') })
  }

  get url () {
    return _private.get(this).url
  }
}

module.exports = PunchOutSetupResponse

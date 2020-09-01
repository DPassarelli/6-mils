const InboundMessage = require('@6-mils/InboundCxmlMessage')

/**
 * A collection of private property values for each instance of this class.
 * @type {WeakMap}
 */
const _private = new WeakMap()

class PunchOutSetupResponse extends InboundMessage {
  constructor (src) {
    try {
      super(src)
    } catch (e) {
      throw new Error('The "cxml" parameter is required and must be well-formed XML.')
    }

    _private.set(
      this,
      {
        url: this.query('/cXML/Response/PunchOutSetupResponse/StartPage/URL/text()') || undefined
      }
    )
  }

  get url () {
    return _private.get(this).url
  }
}

module.exports = PunchOutSetupResponse

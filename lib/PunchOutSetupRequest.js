const debug = require('debug')('6-mils:PunchOutSetupRequest')
const isPlainObject = require('is-plain-obj')
const merge = require('lodash.merge')
const uid = require('ulid').ulid

const OutboundMessage = require('./base/OutboundMessage.js')
const PunchOutSetupResponse = require('./PunchOutSetupResponse.js')

/**
 * A collection of private property values for each instance of this class.
 * @type {WeakMap}
 */
const _private = new WeakMap()

class PunchOutSetupRequest extends OutboundMessage {
  /**
   * Options:
   *
   * {String?}   payloadId     An optional value to be inserted into the
   *                           "payloadID" attribute of the "<cXML>" element. If
   *                           this value is empty or missing, a random
   *                           identifier plus the host "@unknown" will be used.
   *                           If this value starts with the "@" symbol, a
   *                           random identifier plus the given value will be
   *                           used. If it begins with any other character, the
   *                           value will be used as-is.
   *
   * {String?}   buyerCookie   An options value to be inserted into the
   *                           "<BuyerCookie>" element. If this value is missing
   *                           or empty, a random identifier will be generated.
   */
  constructor (options) {
    options = options || {}

    debug('Constructing new message from options %o', options)

    super(merge({ template: 'PunchOutSetupRequest' }, options))

    // Populate the default values for each private property.
    _private.set(this, {
      action: 'create',
      buyerCookie: (options.buyerCookie || uid()),
      postback: ''
    })
  }

  get buyerCookie () {
    return _private.get(this).buyerCookie
  }

  /**
   * Returns the raw cXML of the underlying PunchOutSetupRequest message.
   *
   * @param  {Object?}   options   An optional dictionary that may contain a
   *                               single optional key: `format`. If that key
   *                               has a truthy value, the output will be
   *                               formatted to be more human-readable.
   *
   * @return {String}
   */
  toString (options) {
    options = (options || {})
    return this.generateCxml(_private.get(this), options.format)
  }

  /**
   * Populates the <BrowserFormPost> element in the POSReq body.
   *
   * @param {String}   url   The address that the user's browser will be
   *                         redirected to (along with their shopping cart data)
   *                         once their PunchOut session is complete.
   *
   * @return this
   */
  setPostbackUrl (url) {
    url = (url || '')

    if (url.length === 0 || typeof url !== 'string') {
      throw new Error('The "url" parameter is required and must not be a non-empty string.')
    }

    const props = _private.get(this)
    props.postback = url
    _private.set(this, props)

    return this
  }

  /**
   * Submits the POSReq to the supplier's site.
   *
   * @param  {String}   url   The URL that the XML will be POSTed to. If the
   *                          value '%%TEST%%' is provided, no actual HTTP
   *                          request will take place.
   *
   * @return {Promise}        Fulfilled with an instance of
   *                          {PunchOutSetupResponse}, or rejected if there is a
   *                          problem with the underlying HTTP transmission.
   */
  async submit (url) {
    url = (url || '')

    if (url.length === 0 || typeof url !== 'string') {
      throw new Error('The "url" parameter is required and must not be a non-empty string.')
    }

    if (url === '%%TEST%%') {
      return new PunchOutSetupResponse('%%TEST%%')
    }

    return new PunchOutSetupResponse(await this.sendCxml(url, _private.get(this)))
  }
}

module.exports = PunchOutSetupRequest

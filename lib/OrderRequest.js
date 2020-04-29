const debug = require('debug')('6-mils:OrderRequest')
const merge = require('lodash.merge')
const moment = require('moment')
const nunjucks = require('nunjucks')
const path = require('path')

const OutboundMessage = require('./base/OutboundMessage.js')
const OrderResponse = require('./OrderResponse.js')

const templateEnvironment = nunjucks.configure(path.join(__dirname, './templates'))

/**
 * A collection of private property values for each instance of this class.
 * @type {WeakMap}
 */
const _private = new WeakMap()

class OrderRequest extends OutboundMessage {
  /**
   * Options:
   *
   * {String}    orderId     The unique identifier for the purchase order
   *                         represented by this cXML message.
   *
   * {String?}   orderDate
   */
  constructor (options) {
    options = options || {}
    options.orderId = options.orderId || ''
    options.orderDate = options.orderDate || new Date()

    debug('Constructing new message from options %o', options)

    // Validate option values
    if (!options.orderId) {
      throw new Error('The "orderId" property of the "options" parameter is required and must not be blank.')
    }

    super(merge({ template: 'OrderRequest' }, options))

    const props = {
      id: options.orderId.toString(),
      date: moment(options.orderDate).local().format(),
      orderType: 'regular',
      requestType: 'new'
    }

    _private.set(this, props)
  }

  get orderId () {
    return _private.get(this).id
  }

  get orderDate () {
    return _private.get(this).date
  }

  get orderType () {
    return _private.get(this).orderType
  }

  get requestType () {
    return _private.get(this).requestType
  }

  /**
   * Returns the raw cXML of the underlying OrderRequest message.
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
    return this._generateCxml(_private.get(this), options.format)
  }

  /**
   * Submits the OrderReq to the supplier's site.
   *
   * @param  {String}   url   The URL that the XML will be POSTed to. If the
   *                          value '%%TEST%%' is provided, no actual HTTP
   *                          request will take place.
   *
   * @return {Promise}        Fulfilled with an instance of {OrderResponse}, or
   *                          rejected if there is a problem with the underlying
   *                          HTTP transmission.
   */
  async submit (url) {
    url = (url || '')

    if (url.length === 0 || typeof url !== 'string') {
      throw new Error('The "url" parameter is required and must not be a non-empty string.')
    }

    if (url === '%%TEST%%') {
      const cxml = templateEnvironment.render(
        'OrderResponse',
        {
          version: '1.1.1',
          timestamp: (new Date()).toISOString(),
          payloadId: 'TEST',
          status: {
            code: '200',
            shortName: 'OK',
            description: ''
          }
        }
      )

      return new OrderResponse(cxml)
    }

    return new OrderResponse(await this._sendCxml(url, _private.get(this)))
  }
}

module.exports = OrderRequest

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
   * Adds a line item to this purchase order.
   *
   * @param {Object}   item   A plain object containing the keys "name",
   *                          "quantity", "supplierPartId", "unitPrice", and
   *                          "uom".
   *
   * @return {undefined}
   */
  addItem (item) {
    item = item || {}

    // Validate input
    if (item.name == null) {
      throw new Error('When adding an item to the order, "name" is a required property for "item".')
    }

    if (item.quantity == null || isNaN(item.quantity * 1)) {
      throw new Error('When adding an item to the order, "quantity" is a required property for "item" and must be numeric.')
    }

    if (item.supplierPartId == null) {
      throw new Error('When adding an item to the order, "supplierPartId" is a required property for "item".')
    }

    if (item.unitPrice == null || isNaN(item.unitPrice * 1)) {
      throw new Error('When adding an item to the order, "unitPrice" is a required property for "item" and must be numeric.')
    }

    if (item.uom == null) {
      throw new Error('When adding an item to the order, "uom" is a required property for "item".')
    }

    debug('Adding item to order #%s: %o', _private.get(this).id, item)
  }

  /**
   * Adds multiple line items to this purchase order.
   *
   * @param {Array}   items   A list of items following the same requirements
   *                          for "addItem".
   *
   * @return this
   */
  addItems (items) {
    if (!Array.isArray(items)) {
      throw new Error('The "items" parameter is required and must be an instance of Array.')
    }

    items.forEach((item) => this.addItem(item))

    return this
  }

  /**
   * [setBillingInfo description]
   *
   * @param {Object}   options
   *
   * @return this
   */
  setBillingInfo (options) {
    options = options || {}

    // Input validation
    if (options.address == null) {
      throw new Error('The "options" parameter is required and must at least contain the "address" property.')
    }

    if (!options.address.countryCode || !options.address.companyName) {
      throw new Error('The bill-to address must at least contain the "companyName" and "countryCode" properties, with non-blank values.')
    }

    if (options.email && !options.email.address) {
      throw new Error('The bill-to e-mail must at least contain the "address" property with a non-blank value.')
    }

    if (options.phone) {
      if (!options.phone.countryCode || !options.phone.areaOrCityCode || !options.phone.number) {
        throw new Error('The bill-to phone must at least contain the "countryCode", "areaOrCityCode", and "number" properties, with non-blank values.')
      }
    }

    if (options.pcard) {
      if (!options.pcard.number || !options.pcard.expiration) {
        throw new Error('The bill-to purchasing card must contain the "number" and "expiration" properties, with non-blank values. "expiration" must be either a string in ISO 8601 format, or an instance of {Date}.')
      }

      if (typeof options.pcard.expiration === 'string' && !moment(options.pcard.expiration, moment.ISO_8601, true).isValid()) {
        throw new Error('The bill-to purchasing card must contain the "number" and "expiration" properties, with non-blank values. "expiration" must be either a string in ISO 8601 format, or an instance of {Date}.')
      } else if (!(options.pcard.expiration instanceof Date)) {
        throw new Error('The bill-to purchasing card must contain the "number" and "expiration" properties, with non-blank values. "expiration" must be either a string in ISO 8601 format, or an instance of {Date}.')
      }
    }
  }

  /**
   * [setShippingInfo description]
   *
   * @param {Object}   options
   *
   * @return this
   */
  setShippingInfo () {}

  /**
   * [setTotal description]
   *
   * @param {Object}   options
   *
   * @return this
   */
  setTotal () {}

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

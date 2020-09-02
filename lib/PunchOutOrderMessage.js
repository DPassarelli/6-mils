const debug = require('debug')('6-mils:PunchOutOrderMessage')
const InboundMessage = require('@6-mils/InboundCxmlMessage')

/**
 * A collection of private property values for each instance of this class.
 * @type {WeakMap}
 */
const _private = new WeakMap()

class PunchOutOrderMessage extends InboundMessage {
  constructor (src) {
    try {
      super(src)
    } catch (e) {
      throw new Error('The "cxml" parameter is required and must be well-formed XML.')
    }

    /**
     * The set of private property values for this instance.
     * @type {Object}
     */
    const props = {
      from: {
        domain: this.query('/cXML/Header/From/Credential/@domain/data()'),
        id: this.query('/cXML/Header/From/Credential/Identity/text()')
      },
      to: {
        domain: this.query('/cXML/Header/To/Credential/@domain/data()'),
        id: this.query('/cXML/Header/To/Credential/Identity/text()')
      },
      sender: {
        domain: this.query('/cXML/Header/Sender/Credential/@domain/data()'),
        id: this.query('/cXML/Header/Sender/Credential/Identity/text()'),
        ua: this.query('/cXML/Header/Sender/UserAgent/text()')
      },
      buyerCookie: this.query('/cXML/Message/PunchOutOrderMessage/BuyerCookie/text()'),
      items: [],
      total: {
        cost: 0,
        currency: '',
        items: parseInt(this.query('/cXML/Message/PunchOutOrderMessage/count(ItemIn)'), 10),
        units: 0
      }
    }

    debug('PunchOutOrderMessage received from %o', props.from)

    for (let i = 1; i <= props.total.items; i++) {
      const pathPrefix = `/cXML/Message/PunchOutOrderMessage/ItemIn[${i}]`
      const thisItem = {
        quantity: parseInt(this.query(`${pathPrefix}/@quantity/data()`), 10),
        supplierPartId: this.query(`${pathPrefix}/ItemID/SupplierPartID/text()`),
        supplierPartAuxId: this.query(`${pathPrefix}/ItemID/SupplierPartAuxiliaryID/text()`),
        currency: this.query(`${pathPrefix}/ItemDetail/UnitPrice/Money/@currency/data()`),
        unitPrice: parseFloat(this.query(`${pathPrefix}/ItemDetail/UnitPrice/Money/text()`)),
        uom: this.query(`${pathPrefix}/ItemDetail/UnitOfMeasure/text()`),
        description: this.query(`${pathPrefix}/ItemDetail/Description/text()`).trim(),
        name: this.query(`${pathPrefix}/ItemDetail/Description/ShortName/text()`),
        classification: {}
      }

      if (thisItem.name.length === 0) {
        thisItem.name = thisItem.description
      }

      const classificationCount = this.query(`${pathPrefix}/ItemDetail/count(Classification)`)

      for (let j = 1; j <= classificationCount; j++) {
        const key = this.query(`${pathPrefix}/ItemDetail/Classification[${j}]/@domain/data()`)
        thisItem.classification[key] = this.query(`${pathPrefix}/ItemDetail/Classification[${j}]/text()`)
      }

      debug('PunchOutOrderMessage includes item %o', thisItem)

      props.items.push(thisItem)
      props.total.units = props.total.units + thisItem.quantity
    }

    if (props.items.length > 0) {
      props.total.cost = parseFloat(this.query('/cXML/Message/PunchOutOrderMessage/PunchOutOrderMessageHeader/Total/Money/text()'))
      props.total.currency = this.query('/cXML/Message/PunchOutOrderMessage/PunchOutOrderMessageHeader/Total/Money/@currency/data()')
    }

    _private.set(this, props)
  }

  get buyerCookie () {
    return _private.get(this).buyerCookie
  }

  get supplierInfo () {
    return _private.get(this).from
  }

  get items () {
    return _private.get(this).items
  }

  get senderInfo () {
    return _private.get(this).sender
  }

  get buyerInfo () {
    return _private.get(this).to
  }

  get total () {
    return _private.get(this).total
  }
}

module.exports = PunchOutOrderMessage

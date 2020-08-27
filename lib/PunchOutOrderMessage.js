const converter = require('xml-js')
const debug = require('debug')('6-mils:PunchOutOrderMessage')

const InboundMessage = require('./base/InboundMessage.js')

/**
 * A collection of private property values for each instance of this class.
 * @type {WeakMap}
 */
const _private = new WeakMap()

class PunchOutOrderMessage extends InboundMessage {
  constructor (src) {
    super(src)

    /**
     * The set of private property values for this instance.
     * @type {Object}
     */
    const props = {}

    /**
     * The incoming cXML message, represented as a plain JS object. This makes
     * it easier to navigate thru the document and find specific pieces of data.
     * @type {Object}
     */
    let xmlObject = null

    try {
      xmlObject = converter.xml2js(src)
    } catch (e) {
      throw new Error('The "cxml" parameter is required and must be well-formed XML.')
    }

    const headerElement = xmlObject
      .elements
      .find((elem) => { return elem.name === 'cXML' })
      .elements
      .find((elem) => { return elem.name === 'Header' })

    const toElement = headerElement.elements.find((elem) => { return elem.name === 'To' })
    debug('Found "To" element %o', toElement)
    props.to = {
      domain: toElement.elements[0].attributes.domain,
      id: toElement.elements[0].elements[0].elements[0].text
    }

    const fromElement = headerElement.elements.find((elem) => { return elem.name === 'From' })
    debug('Found "From" element %o', fromElement)
    props.from = {
      domain: fromElement.elements[0].attributes.domain,
      id: fromElement.elements[0].elements[0].elements[0].text
    }

    const senderElement = headerElement.elements.find((elem) => { return elem.name === 'Sender' })
    debug('Found "Sender" element %o', senderElement)
    props.sender = {
      domain: senderElement.elements[0].attributes.domain,
      id: senderElement.elements[0].elements[0].elements[0].text,
      ua: senderElement.elements[1].elements[0].text
    }

    const messageElement = xmlObject
      .elements
      .find((elem) => { return elem.name === 'cXML' })
      .elements
      .find((elem) => { return elem.name === 'Message' })
      .elements[0]

    debug('Found "PunchOutOrderMessage" element %o', messageElement)

    props.buyerCookie = messageElement
      .elements
      .find((elem) => { return elem.name === 'BuyerCookie' })
      .elements[0]
      .text

    props.items = []

    /**
     * The total number of units in the order. This is a summation of all item
     * quantities.
     * @type {Number}
     */
    let totalCount = 0

    messageElement
      .elements
      .filter((elem) => { return elem.name === 'ItemIn' })
      .forEach((elem) => {
        debug('Found "Item" element %j', elem)

        /**
         * The shopping cart item described by this XML fragment.
         * @type {Object}
         */
        const item = {}

        const itemIdElem = elem.elements.find((e) => { return e.name === 'ItemID' })
        const itemDetailElem = elem.elements.find((e) => { return e.name === 'ItemDetail' })
        const itemPriceElem = itemDetailElem.elements.find((e) => { return e.name === 'UnitPrice' })

        item.quantity = parseInt(elem.attributes.quantity, 10)
        item.supplierPartId = itemIdElem.elements.find((e) => { return e.name === 'SupplierPartID' }).elements[0].text
        item.supplierPartAuxId = itemIdElem.elements.find((e) => { return e.name === 'SupplierPartAuxiliaryID' }).elements[0].text
        item.currency = itemPriceElem.elements[0].attributes.currency
        item.unitPrice = parseFloat(itemPriceElem.elements[0].elements[0].text)
        item.uom = itemDetailElem.elements.find((e) => { return e.name === 'UnitOfMeasure' }).elements[0].text
        item.classification = {}

        itemDetailElem
          .elements
          .filter((e) => { return e.name === 'Classification' })
          .forEach((e) => {
            const classificationName = e.attributes.domain
            const classificationValue = e.elements[0].text

            item.classification[classificationName] = classificationValue
          })

        const itemDescriptionElem = itemDetailElem.elements.find((e) => { return e.name === 'Description' })

        debug('Found "Description" element %j', itemDescriptionElem)

        item.description = itemDescriptionElem.elements.find((e) => { return e.type === 'text' }).text
        const shortNameElem = itemDescriptionElem.elements.find((e) => { return e.name === 'ShortName' })
        if(shortNameElem && shortNameElem.elements.length > 0)
        {
          item.name = shortNameElem.elements[0].text
        } else {
          item.name = item.description
        }

        debug('Pushing item into array %o', item)
        props.items.push(item)

        totalCount = totalCount + item.quantity
      })

    const messageHeaderElem = messageElement.elements.find((e) => { return e.name === 'PunchOutOrderMessageHeader' })
    let totalAmtElem = null

    if (messageHeaderElem) {
      totalAmtElem = messageHeaderElem.elements.find((e) => { return e.name === 'Total' }).elements[0]
      debug('Found "Total" element %j', totalAmtElem)
    } else {
      debug('No "PunchOutOrderMessageHeader" element found.')
    }

    props.total = {
      cost: (totalAmtElem
        ? parseFloat(totalAmtElem.elements[0].text)
        : 0
      ),
      currency: (totalAmtElem
        ? totalAmtElem.attributes.currency
        : ''
      ),
      items: props.items.length,
      units: totalCount
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

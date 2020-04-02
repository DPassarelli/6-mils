const _ = new WeakMap()

const converter = require('xml-js')
const debug = require('debug')('6-mils:PunchOutOrderMessage')

class PunchOutOrderMessage {
  /**
   * @param  {String}   src   The source XML used to populate this instance.
   */
  constructor (src) {
    src = (src || '')

    if (src.length === 0) {
      throw new Error('The "cxml" parameter is required and must be well-formed XML.')
    }

    debug('Constructing from source "%s"', src)

    let xmlObject = null
    const privateProperties = {}

    try {
      xmlObject = converter.xml2js(src)
    } catch (e) {
      throw new Error('The "cxml" parameter is required and must be well-formed XML.')
    }

    const doctype = xmlObject.elements.find((elem) => { return elem.type === 'doctype' }).doctype
    debug('Found doctype "%s"', doctype)
    privateProperties.version = /[1-9]+\.\d+\.\d+/.exec(doctype)[0]

    const rootNode = xmlObject.elements.find((elem) => { return elem.name === 'cXML' })
    debug('Found root node %o', rootNode)
    privateProperties.payloadId = rootNode.attributes.payloadID
    privateProperties.timestamp = rootNode.attributes.timestamp

    const headerElement = xmlObject
      .elements
      .find((elem) => { return elem.name === 'cXML' })
      .elements
      .find((elem) => { return elem.name === 'Header' })

    const toElement = headerElement.elements.find((elem) => { return elem.name === 'To' })
    debug('Found "To" element %o', toElement)
    privateProperties.to = {
      domain: toElement.elements[0].attributes.domain,
      id: toElement.elements[0].elements[0].elements[0].text
    }

    const fromElement = headerElement.elements.find((elem) => { return elem.name === 'From' })
    debug('Found "From" element %o', fromElement)
    privateProperties.from = {
      domain: fromElement.elements[0].attributes.domain,
      id: fromElement.elements[0].elements[0].elements[0].text
    }

    const senderElement = headerElement.elements.find((elem) => { return elem.name === 'Sender' })
    debug('Found "Sender" element %o', senderElement)
    privateProperties.sender = {
      domain: senderElement.elements[0].attributes.domain,
      id: senderElement.elements[0].elements[0].elements[0].text,
      ua: senderElement.elements[1].elements[0].text
    }

    const messageElement = xmlObject
      .elements
      .find((elem) => { return elem.name === 'cXML' })
      .elements
      .find((elem) => { return elem.name === 'Message' })

    privateProperties.buyerCookie = messageElement
      .elements[0]
      .elements
      .find((elem) => { return elem.name === 'BuyerCookie' })
      .elements[0]
      .text

    _.set(this, privateProperties)
  }

  get buyerCookie () {
    return _.get(this).buyerCookie
  }

  get from () {
    return _.get(this).from
  }

  get payloadId () {
    return _.get(this).payloadId
  }

  get sender () {
    return _.get(this).sender
  }

  get timestamp () {
    return _.get(this).timestamp
  }

  get to () {
    return _.get(this).to
  }

  get version () {
    return _.get(this).version
  }
}

module.exports = PunchOutOrderMessage

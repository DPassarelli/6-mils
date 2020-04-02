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

    _.set(this, privateProperties)
  }

  get payloadId () {
    return _.get(this).payloadId
  }

  get timestamp () {
    return _.get(this).timestamp
  }

  get version () {
    return _.get(this).version
  }
}

module.exports = PunchOutOrderMessage

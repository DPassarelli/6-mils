const converter = require('xml-js')
const debug = require('debug')('6-mils:InboundMessage')

/**
 * A collection of private property values for each instance of this class.
 * @type {WeakMap}
 */
const _private = new WeakMap()

/**
 * This base class is intended to provide the basic functionality for parsing
 * messages received from a supplier. The only way to instantiate objects based
 * on this prototype is to provide raw cXML for parsing.
 *
 * @param  {String}   src   The cXML message to parse.
 */
class InboundMessage {
  constructor (src) {
    src = (src || '')

    if (src.length === 0) {
      throw new Error('The "cxml" parameter is required and must be well-formed XML.')
    }

    debug('Constructing from source "%s"', src)

    /**
     * The set of private property values for this instance.
     * @type {Object}
     */
    const props = {}

    if (src === '%%EMPTY%%') {
      /**
       * Sometimes, a supplier may send an empty HTTP response if there is no
       * specific data to respond with (for example, an OrderResponse is nothing
       * more than an acknowledgement, whereas a PunchOutSetupResponse will
       * contain a URL). In this case, the properties of the incoming message
       * are all set to reasonable defaults.
       */
      props.version = require('../shared/cxml-version.js')
      props.payloadId = require('../shared/new-payload-id.js')()
      props.timestamp = (new Date()).toISOString()
      props.statusCode = '200'
      props.statusText = 'success'
    } else {
      try {
        props.xmlObject = converter.xml2js(src)
      } catch (e) {
        throw new Error('The "cxml" parameter is required and must be well-formed XML.')
      }

      const doctype = props.xmlObject.elements.find((elem) => { return elem.type === 'doctype' }).doctype
      debug('Found doctype "%s"', doctype)
      props.version = /[1-9]+\.\d+\.\d+/.exec(doctype)[0]

      const rootNode = props.xmlObject.elements.find((elem) => { return elem.name === 'cXML' })
      debug('Found root node %o', rootNode)
      props.payloadId = rootNode.attributes.payloadID
      props.timestamp = rootNode.attributes.timestamp

      const statusElem = props.xmlObject
        .elements
        .find((elem) => { return elem.name === 'cXML' })
        .elements[0]
        .elements
        .find((elem) => { return elem.name === 'Status' })

      if (statusElem) {
        debug('Found "Status" element %o', statusElem)

        if (statusElem.attributes.code !== '200') {
          debug('FAILURE status')
          props.statusCode = statusElem.attributes.code

          if (statusElem.elements && statusElem.elements.length > 0) {
            props.statusText = statusElem.elements[0].text
          } else {
            props.statusText = statusElem.attributes.text
          }
        } else {
          props.statusCode = '200'
          props.statusText = 'success'
        }
      }
    }

    // Populate the default values for each private property.
    _private.set(this, props)
  }

  get timestamp () {
    return _private.get(this).timestamp
  }

  get version () {
    return _private.get(this).version
  }

  get payloadId () {
    return _private.get(this).payloadId
  }

  get statusCode () {
    return _private.get(this).statusCode
  }

  get statusText () {
    return _private.get(this).statusText
  }

  toString (options) {
    options = (options || {})

    const xmlObject = _private.get(this).xmlObject

    return (
      options.format
        ? converter.js2xml(xmlObject, { spaces: 2, fullTagEmptyElement: true })
        : converter.js2xml(xmlObject)
    )
  }

  /**
   * Search for the specified element and return the value (text between opening
   * and closing tags) of that element.
   *
   * @param  {String}   name         The name of the element to search for.
   *
   * @param  {Object}   entryPoint   The node to start searching from. This
   *                                 function will call itself to look thru all
   *                                 descendents.
   *
   * @return {String}   The value of the element, if found, or `undefined`.
   */
  _getElementValue (name, entryPoint) {
    if (entryPoint == null) { entryPoint = _private.get(this).xmlObject }

    if (Array.isArray(entryPoint.elements)) {
      if (entryPoint.elements.length === 0) return

      for (let i = 0; i < entryPoint.elements.length; i++) {
        if (entryPoint.elements[i].type === 'element' && entryPoint.elements[i].name === name) {
          if (Array.isArray(entryPoint.elements[i].elements) && entryPoint.elements[i].elements[0].type === 'text') {
            return entryPoint.elements[i].elements[0].text
          }
        }

        const result = this._getElementValue(name, entryPoint.elements[i])
        if (result) return result
      }
    }
  }
}

module.exports = InboundMessage

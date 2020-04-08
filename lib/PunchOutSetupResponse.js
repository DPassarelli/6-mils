const converter = require('xml-js')
const debug = require('debug')('6-mils:PunchOutSetupResponse')
const fs = require('fs')
const path = require('path')

const SAMPLE_CXML = fs.readFileSync(path.join(__dirname, '../test/samples/PunchOutSetupResponse-200.xml'))

/**
 * A collection of private property values for each instance of this class.
 * @type {WeakMap}
 */
const _private = new WeakMap()

class PunchOutSetupResponse {
  /**
   * @param  {String?}   src   The source XML used to populate this instance. If
   *                           missing or empty, all property values will be
   *                           blank. If the special value '%%TEST%%' is
   *                           provided, then a sample XML document will be used
   *                           as the source.
   */
  constructor (src) {
    src = (src || '')

    /**
     * The set of private property values for this instance.
     * @type {Object}
     */
    const props = {
      payloadId: '',
      statusCode: '',
      statusText: '',
      timestamp: '',
      url: '',
      version: ''
    }

    if (src.length === 0) {
      _private.set(this, props)
      return
    } else if (src === '%%TEST%%') {
      src = SAMPLE_CXML
    }

    debug('Constructing POSRes from source "%s"', src)

    /**
     * The incoming cXML message, represented as a plain JS object. This makes
     * it easier to navigate thru the document and find specific pieces of data.
     * @type {Object}
     */
    const xmlObject = converter.xml2js(src)

    const doctype = xmlObject.elements.find((elem) => { return elem.type === 'doctype' }).doctype
    debug('Found doctype "%s"', doctype)
    props.version = /[1-9]+\.\d+\.\d+/.exec(doctype)[0]

    const rootNode = xmlObject.elements.find((elem) => { return elem.name === 'cXML' })
    debug('Found root node %o', rootNode)
    props.payloadId = rootNode.attributes.payloadID
    props.timestamp = rootNode.attributes.timestamp

    const statusElem = xmlObject
      .elements
      .find((elem) => { return elem.name === 'cXML' })
      .elements[0]
      .elements
      .find((elem) => { return elem.name === 'Status' })

    debug('Found "Status" element %o', statusElem)

    if (statusElem.attributes.code !== '200') {
      debug('FAILURE status')
      props.statusCode = statusElem.attributes.code

      if (statusElem.elements && statusElem.elements.length > 0) {
        props.statusText = statusElem.elements[0].text
      } else {
        props.statusText = statusElem.attributes.text.toLowerCase()
      }
    } else {
      props.statusCode = '200'
      props.statusText = 'success'

      const urlElem = xmlObject
        .elements
        .find((elem) => { return elem.name === 'cXML' })
        .elements[0]
        .elements
        .find((elem) => { return elem.name === 'PunchOutSetupResponse' })
        .elements[0]
        .elements[0]

      debug('Found "URL" element %o', urlElem)

      props.url = urlElem.elements[0].text
    }

    _private.set(this, props)
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

  get timestamp () {
    return _private.get(this).timestamp
  }

  get url () {
    return _private.get(this).url
  }

  get version () {
    return _private.get(this).version
  }
}

module.exports = PunchOutSetupResponse

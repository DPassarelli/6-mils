const _ = new WeakMap()

const converter = require('xml-js')
const debug = require('debug')('6-mils:PunchOutSetupResponse')
const fs = require('fs')
const path = require('path')

const SAMPLE_CXML = fs.readFileSync(path.join(__dirname, '../test/samples/PunchOutSetupResponse-200.xml'))

class PunchOutSetupResponse {
  constructor (src) {
    src = (src || '')

    const privateProperties = {
      payloadId: '',
      statusCode: '',
      statusText: '',
      timestamp: '',
      url: '',
      version: ''
    }

    if (src.length === 0) {
      _.set(this, privateProperties)
      return
    } else if (src === '%%TEST%%') {
      src = SAMPLE_CXML
    }

    debug('Constructing POSRes from source "%s"', src)

    const xmlObject = converter.xml2js(src)

    const doctype = xmlObject.elements.find((elem) => { return elem.type === 'doctype' }).doctype
    debug('Found doctype "%s"', doctype)
    privateProperties.version = /[1-9]+\.\d+\.\d+/.exec(doctype)[0]

    const rootNode = xmlObject.elements.find((elem) => { return elem.name === 'cXML' })
    debug('Found root node %o', rootNode)
    privateProperties.payloadId = rootNode.attributes.payloadID
    privateProperties.timestamp = rootNode.attributes.timestamp

    const statusElem = xmlObject
      .elements
      .find((elem) => { return elem.name === 'cXML' })
      .elements[0]
      .elements
      .find((elem) => { return elem.name === 'Status' })

    debug('Found "Status" element %o', statusElem)

    if (statusElem.attributes.code !== '200') {
      debug('FAILURE status')
      privateProperties.statusCode = statusElem.attributes.code

      if (statusElem.elements && statusElem.elements.length > 0) {
        privateProperties.statusText = statusElem.elements[0].text
      } else {
        privateProperties.statusText = statusElem.attributes.text.toLowerCase()
      }
    } else {
      privateProperties.statusCode = '200'
      privateProperties.statusText = 'success'

      const urlElem = xmlObject
        .elements
        .find((elem) => { return elem.name === 'cXML' })
        .elements[0]
        .elements
        .find((elem) => { return elem.name === 'PunchOutSetupResponse' })
        .elements[0]
        .elements[0]

      debug('Found "URL" element %o', urlElem)

      privateProperties.url = urlElem.elements[0].text
    }

    _.set(this, privateProperties)
  }

  get payloadId () {
    return _.get(this).payloadId
  }

  get statusCode () {
    return _.get(this).statusCode
  }

  get statusText () {
    return _.get(this).statusText
  }

  get timestamp () {
    return _.get(this).timestamp
  }

  get url () {
    return _.get(this).url
  }

  get version () {
    return _.get(this).version
  }
}

module.exports = PunchOutSetupResponse

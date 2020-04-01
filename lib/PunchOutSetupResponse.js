const _ = new WeakMap()

const converter = require('xml-js')
const debug = require('debug')('6-mils:PunchOutSetupResponse')
const fs = require('fs')
const path = require('path')

const SAMPLE_CXML = fs.readFileSync(path.join(__dirname, '../test/samples/PunchOutSetupResponse-200.xml'))

class PunchOutSetupResponse {
  constructor (src) {
    src = (src || '')

    if (src.length === 0) {
      _.set(this, { version: 'n/a', payloadId: 'n/a' })
      return
    }

    if (src === '%%TEST%%') {
      src = SAMPLE_CXML
    }

    debug('Constructing POSRes from source "%s"', src)

    const xmlObject = converter.xml2js(src)

    const doctype = xmlObject.elements.find((elem) => { return elem.type === 'doctype' }).doctype
    debug('Found doctype "%s"', doctype)

    const rootNode = xmlObject.elements.find((elem) => { return elem.name === 'cXML' })
    debug('Found root node %o', rootNode)

    const statusElem = xmlObject
      .elements
      .find((elem) => { return elem.name === 'cXML' })
      .elements[0]
      .elements
      .find((elem) => { return elem.name === 'Status' })

    debug('Found "Status" element %o', statusElem)

    const urlElem = xmlObject
      .elements
      .find((elem) => { return elem.name === 'cXML' })
      .elements[0]
      .elements
      .find((elem) => { return elem.name === 'PunchOutSetupResponse' })
      .elements[0]
      .elements[0]

    debug('Found "URL" element %o', urlElem)

    _.set(this, {
      payloadId: rootNode.attributes.payloadID,
      statusCode: statusElem.attributes.code,
      statusText: statusElem.attributes.text,
      timestamp: rootNode.attributes.timestamp,
      url: urlElem.elements[0].text,
      version: /[1-9]+\.\d+\.\d+/.exec(doctype)[0]
    })
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

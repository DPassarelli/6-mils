const _ = new WeakMap()
const converter = require('xml-js')

class PunchOutSetupRequest {
  constructor () {
    const posreq = {
      declaration: {
        attributes: {
          version: '1.0',
          encoding: 'utf-8'
        }
      },
      elements: [
        {
          type: 'doctype',
          doctype: 'cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.045/cXML.dtd"'
        },
        {
          type: 'element',
          name: 'cXML',
          attributes: {
            'xml:lang': 'en-US'
          },
          elements: [
            {
              type: 'element',
              name: 'Header',
              elements: []
            }
          ]
        }
      ]
    }

    _.set(this, { xmlObject: posreq })
  }

  toString () {
    return converter.js2xml(
      _.get(this).xmlObject,
      {
        fullTagEmptyElement: true,
        spaces: 0
      }
    )
  }
}

module.exports = PunchOutSetupRequest

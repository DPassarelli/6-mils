const _ = new WeakMap()
const converter = require('xml-js')

class PunchOutSetupRequest {
  constructor () {
    /**
     * Populate the default values for each private property.
     */
    _.set(this, {
      payloadId: '',
      timestamp: '',
      from: { domain: '', id: '' },
      to: { domain: '', id: '' },
      sender: { domain: '', id: '', secret: '', agent: '' },
      buyerCookie: '',
      postback: ''
    })
  }

  /**
   * Returns the raw cXML of the underlying PunchOutSetupRequest message
   * @return {String}
   */
  toString (options) {
    options = (options || {})

    const privateProperties = _.get(this)

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
            'xml:lang': 'en-US',
            payloadID: privateProperties.payloadId,
            timestamp: privateProperties.timestamp
          },
          elements: [
            {
              type: 'element',
              name: 'Header',
              elements: [
                {
                  type: 'element',
                  name: 'From',
                  elements: [
                    {
                      type: 'element',
                      name: 'Credential',
                      attributes: {
                        domain: privateProperties.from.domain
                      },
                      elements: [
                        {
                          type: 'element',
                          name: 'Identity',
                          elements: [
                            {
                              type: 'text',
                              text: privateProperties.from.id
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'element',
                  name: 'To',
                  elements: [
                    {
                      type: 'element',
                      name: 'Credential',
                      attributes: {
                        domain: privateProperties.to.domain
                      },
                      elements: [
                        {
                          type: 'element',
                          name: 'Identity',
                          elements: [
                            {
                              type: 'text',
                              text: privateProperties.to.id
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'element',
                  name: 'Sender',
                  elements: [
                    {
                      type: 'element',
                      name: 'Credential',
                      attributes: {
                        domain: privateProperties.to.domain
                      },
                      elements: [
                        {
                          type: 'element',
                          name: 'Identity',
                          elements: [
                            {
                              type: 'text',
                              text: privateProperties.to.id
                            }
                          ]
                        },
                        {
                          type: 'element',
                          name: 'SharedSecret',
                          elements: [
                            {
                              type: 'text',
                              text: privateProperties.sender.secret
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: 'element',
                      name: 'UserAgent',
                      elements: [
                        {
                          type: 'text',
                          text: privateProperties.sender.agent
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: 'element',
              name: 'Request',
              elements: [
                {
                  type: 'element',
                  name: 'PunchOutSetupRequest',
                  attributes: { operation: 'create' },
                  elements: [
                    {
                      type: 'element',
                      name: 'BuyerCookie',
                      elements: [
                        {
                          type: 'text',
                          text: privateProperties.buyerCookie
                        }
                      ]
                    },
                    {
                      type: 'element',
                      name: 'BrowserFormPost',
                      elements: [
                        {
                          type: 'element',
                          name: 'URL',
                          elements: [
                            {
                              type: 'text',
                              text: privateProperties.postback
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }

    return converter.js2xml(
      posreq,
      {
        fullTagEmptyElement: true,
        spaces: (options.format ? 2 : 0)
      }
    )
  }

  /**
   * Populates the <From> element in the POSReq envelope.
   *
   * @param {Object}   options   A dictionary with keys "domain" and "id".
   *
   * @return this
   */
  setBuyerInfo (options) {
    options = options || {}
    options.domain = options.domain || ''
    options.id = options.id || ''

    const privateProperties = _.get(this)
    privateProperties.from = options
    _.set(this, privateProperties)

    return this
  }

  /**
   * Populates the <To> element in the POSReq envelope.
   *
   * @param {Object}   options   A dictionary with keys "domain" and "id".
   *
   * @return this
   */
  setSupplierInfo (options) {
    options = options || {}
    options.domain = options.domain || ''
    options.id = options.id || ''

    const privateProperties = _.get(this)
    privateProperties.to = options
    _.set(this, privateProperties)

    return this
  }
}

module.exports = PunchOutSetupRequest

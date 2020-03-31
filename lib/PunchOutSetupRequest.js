const _ = new WeakMap()
const converter = require('xml-js')
const merge = require('lodash.merge')
const packageInfo = require('../package.json')
const process = require('process')
const uid = require('ulid').ulid

/**
 * [getRandomPayloadIdentifier description]
 * @return {[type]} [description]
 */
function getRandomPayloadIdentifier () {
  return `${(new Date()).getTime()}.${process.ppid}.${uid().substring(16)}`
}

/**
 * [escapeControlCharacters description]
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
function escapeControlCharacters (text) {
  return text.toString()
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

class PunchOutSetupRequest {
  /**
   * [constructor description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  constructor (options) {
    options = options || {}

    options.payloadId = (options.payloadId || '')
    options.buyerCookie = (options.buyerCookie || uid())

    /**
     *
     */
    if (options.payloadId.length === 0) {
      options.payloadId = `${getRandomPayloadIdentifier()}@unknown`
    } else if (options.payloadId.toString().startsWith('@')) {
      options.payloadId = `${getRandomPayloadIdentifier()}${options.payloadId}`
    }

    // Populate the default values for each private property.
    _.set(this, {
      payloadId: options.payloadId,
      timestamp: '',
      from: { domain: '', id: '' },
      to: { domain: '', id: '' },
      sender: { domain: '', id: '', secret: '', ua: '' },
      buyerCookie: options.buyerCookie,
      postback: ''
    })
  }

  /**
   * Returns the raw cXML of the underlying PunchOutSetupRequest message.
   * @return {String}
   */
  toString (options) {
    options = (options || {})

    const privateProperties = _.get(this)

    if (privateProperties.sender.ua.length === 0) {
      privateProperties.sender.ua = `6-mils@${packageInfo.version}`
      _.set(this, privateProperties)
    }

    // TODO: populate the timestamp when the message is sent, and then do not
    // allow it to changed
    // if (privateProperties.timestamp.length === 0) {
    //   privateProperties.timestamp = moment().local().format()
    //   _.set(this, privateProperties)
    // }

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
            payloadID: escapeControlCharacters(privateProperties.payloadId),
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
                        domain: escapeControlCharacters(privateProperties.from.domain)
                      },
                      elements: [
                        {
                          type: 'element',
                          name: 'Identity',
                          elements: [
                            {
                              type: 'text',
                              text: escapeControlCharacters(privateProperties.from.id)
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
                        domain: escapeControlCharacters(privateProperties.to.domain)
                      },
                      elements: [
                        {
                          type: 'element',
                          name: 'Identity',
                          elements: [
                            {
                              type: 'text',
                              text: escapeControlCharacters(privateProperties.to.id)
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
                        domain: escapeControlCharacters(privateProperties.sender.domain)
                      },
                      elements: [
                        {
                          type: 'element',
                          name: 'Identity',
                          elements: [
                            {
                              type: 'text',
                              text: escapeControlCharacters(privateProperties.sender.id)
                            }
                          ]
                        },
                        {
                          type: 'element',
                          name: 'SharedSecret',
                          elements: [
                            {
                              type: 'text',
                              text: escapeControlCharacters(privateProperties.sender.secret)
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
                          text: escapeControlCharacters(privateProperties.sender.ua)
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
                          text: escapeControlCharacters(privateProperties.buyerCookie)
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
                              text: escapeControlCharacters(privateProperties.postback)
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

    // Convert null values to empty strings to maintain consistency with default
    // values.
    Object.keys(options).forEach(key => {
      if (options[key] === null) options[key] = ''
    })

    const privateProperties = _.get(this)
    privateProperties.from = merge(privateProperties.from, options)
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

    // Convert null values to empty strings to maintain consistency with default
    // values.
    Object.keys(options).forEach(key => {
      if (options[key] === null) options[key] = ''
    })

    const privateProperties = _.get(this)
    privateProperties.to = merge(privateProperties.to, options)
    _.set(this, privateProperties)

    return this
  }

  /**
   * Populates the <Sender> element in the POSReq envelope.
   *
   * @param {Object}   options   A dictionary with keys "domain", "id",
   *                             "secret", and "ua".
   *
   * @return this
   */
  setSenderInfo (options) {
    options = options || {}

    // Convert null values to empty strings to maintain consistency with default
    // values.
    Object.keys(options).forEach(key => {
      if (options[key] === null) options[key] = ''
    })

    const privateProperties = _.get(this)
    privateProperties.sender = merge(privateProperties.sender, options)
    _.set(this, privateProperties)

    return this
  }
}

module.exports = PunchOutSetupRequest

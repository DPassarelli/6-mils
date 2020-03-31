const _ = new WeakMap()
const merge = require('lodash.merge')
const nunjucks = require('nunjucks')
const packageInfo = require('../package.json')
const process = require('process')
const uid = require('ulid').ulid

const path = require('path')
nunjucks.configure(path.join(__dirname, '../templates'))

/**
 * [getRandomPayloadIdentifier description]
 * @return {[type]} [description]
 */
function getRandomPayloadIdentifier () {
  return `${(new Date()).getTime()}.${process.ppid}.${uid().substring(16)}`
}

/**
 * [stringifyObjectValues description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function stringifyValues (dict) {
  dict = dict || {}

  Object.keys(dict).forEach(key => {
    dict[key] = (dict[key] === null ? '' : dict[key].toString())
  })

  return dict
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
      CXML_VERSION: '1.2.045',
      action: 'create',
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

    const cxml = nunjucks.render('PunchOutSetupRequest', privateProperties)
    return (options.format ? cxml : cxml.replace(/>\s+</g, '><'))
  }

  /**
   * Populates the <From> element in the POSReq envelope.
   *
   * @param {Object}   options   A dictionary with keys "domain" and "id".
   *
   * @return this
   */
  setBuyerInfo (options) {
    const privateProperties = _.get(this)
    privateProperties.from = merge(privateProperties.from, stringifyValues(options))
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
    const privateProperties = _.get(this)
    privateProperties.to = merge(privateProperties.to, stringifyValues(options))
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
    const privateProperties = _.get(this)
    privateProperties.sender = merge(privateProperties.sender, stringifyValues(options))
    _.set(this, privateProperties)

    return this
  }
}

module.exports = PunchOutSetupRequest

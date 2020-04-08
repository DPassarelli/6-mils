const debug = require('debug')('6-mils:PunchOutSetupRequest')
const isPlainObject = require('is-plain-obj')
const merge = require('lodash.merge')
const moment = require('moment')
const nunjucks = require('nunjucks')
const packageInfo = require('../package.json')
const path = require('path')
const process = require('process')
const request = require('got')
const uid = require('ulid').ulid

/**
 * `URL` only became available in Node v10. This is included to support Node v8.
 * @type {URL}
 */
const URL = (global.URL || require('whatwg-url').URL)

const PunchOutSetupResponse = require('./PunchOutSetupResponse.js')

nunjucks.configure(path.join(__dirname, '../templates'))

/**
 * A collection of private property values for each instance of this class.
 * @type {WeakMap}
 */
const _private = new WeakMap()

/**
 * Returns a new random payload identifier, sans host name. This value is
 * constructed according to the suggested implementation in the cXML Reference
 * Guide.
 *
 * @return {String}
 */
function getRandomPayloadIdentifier () {
  return `${(new Date()).getTime()}.${process.ppid}.${uid().substring(16)}`
}

/**
 * This returns a copy of the provided object, with all values converted into
 * their string representations. `null` values are converted into empty strings.
 *
 * @param  {Object}   dict   A dictionary of key-value pairs to convert. This
 *                           value will not be modified.
 *
 * @return {Object}   A new object with the same keys as `dict`.
 */
function stringifyValues (dict) {
  const newDictionary = {}

  if (dict == null) return {}

  if (!isPlainObject(dict)) {
    throw new Error('The "options" parameter, if provided, must be a plain object.')
  }

  Object.keys(dict).forEach(key => {
    newDictionary[key] = (dict[key] === null ? '' : dict[key].toString())
  })

  return newDictionary
}

class PunchOutSetupRequest {
  /**
   * Options:
   *
   * {String?}   payloadId     An optional value to be inserted into the
   *                           "payloadID" attribute of the "<cXML>" element. If
   *                           this value is empty or missing, a random
   *                           identifier plus the host "@unknown" will be used.
   *                           If this value starts with the "@" symbol, a
   *                           random identifier plus the given value will be
   *                           used. If it begins with any other character, the
   *                           value will be used as-is.
   *
   * {String?}   buyerCookie   An options value to be inserted into the
   *                           "<BuyerCookie>" element. If this value is missing
   *                           or empty, a random identifier will be generated.
   */
  constructor (options) {
    options = options || {}

    debug('Constructing new POSReq from options %o', options)

    options.payloadId = (options.payloadId || '')
    options.buyerCookie = (options.buyerCookie || uid())

    if (options.payloadId.length === 0) {
      options.payloadId = `${getRandomPayloadIdentifier()}@unknown`
    } else if (options.payloadId.toString().startsWith('@')) {
      options.payloadId = `${getRandomPayloadIdentifier()}${options.payloadId}`
    }

    // Populate the default values for each private property.
    _private.set(this, {
      CXML_VERSION: '1.2.045',
      action: 'create',
      payloadId: options.payloadId,
      timestamp: '',
      from: { domain: '', id: '' },
      to: { domain: '', id: '' },
      sender: { domain: '', id: '', secret: '', ua: '' },
      buyerCookie: options.buyerCookie,
      extrinsics: {},
      postback: ''
    })
  }

  get buyerCookie () {
    return _private.get(this).buyerCookie
  }

  get payloadId () {
    return _private.get(this).payloadId
  }

  /**
   * Returns the raw cXML of the underlying PunchOutSetupRequest message.
   * @return {String}
   */
  toString (options) {
    options = (options || {})

    const props = _private.get(this)

    if (props.sender.ua.length === 0) {
      props.sender.ua = `6-mils@${packageInfo.version}`
      _private.set(this, props)
    }

    const cxml = nunjucks.render('PunchOutSetupRequest', props)

    /**
     * The template is assumed to be properly formatted to begin with. If
     * no formatting is desired, then any whitespace that exists between tags is
     * removed.
     */
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
    const props = _private.get(this)
    props.from = merge(props.from, stringifyValues(options))
    _private.set(this, props)

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
    const props = _private.get(this)
    props.to = merge(props.to, stringifyValues(options))
    _private.set(this, props)

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
    const props = _private.get(this)
    props.sender = merge(props.sender, stringifyValues(options))
    _private.set(this, props)

    return this
  }

  /**
   * Populates the <Extrinsic> element(s) in the POSReq body.
   *
   * @param {Object}   dict   A dictionary of key-value pairs that will be used
   *                          to generate the "<Extrinsic>" elements.
   *
   * @return this
   */
  setExtrinsic (dict) {
    dict = (dict || {})

    if (!isPlainObject(dict)) {
      throw new Error('The "dict" parameter, if provided, must be a plain object.')
    }

    const props = _private.get(this)
    props.extrinsics = dict
    _private.set(this, props)

    return this
  }

  /**
   * Populates the <BrowserFormPost> element in the POSReq body.
   *
   * @param {String}   url   The address that the user's browser will be
   *                         redirected to (along with their shopping cart data)
   *                         once their PunchOut session is complete.
   *
   * @return this
   */
  setPostbackUrl (url) {
    url = (url || '')

    if (url.length === 0 || typeof url !== 'string') {
      throw new Error('The "url" parameter is required and must not be a non-empty string.')
    }

    const props = _private.get(this)
    props.postback = url
    _private.set(this, props)

    return this
  }

  /**
   * Submits the POSReq to the supplier's site.
   *
   * @param  {String}   url   The URL that the XML will be POSTed to. If the
   *                          value '%%TEST%%' is provided, no actual HTTP
   *                          request will take place.
   *
   * @return {Promise}        Fulfilled with an instance of
   *                          {PunchOutSetupResponse}, or rejected if there is a
   *                          problem with the underlying HTTP transmission.
   */
  async submit (url) {
    url = (url || '')

    if (url.length === 0 || typeof url !== 'string') {
      throw new Error('The "url" parameter is required and must not be a non-empty string.')
    }

    if (url === '%%TEST%%') {
      return new PunchOutSetupResponse('%%TEST%%')
    }

    const props = _private.get(this)
    props.timestamp = moment().local().format()
    debug('Timestamp set to %s', props.timestamp)
    _private.set(this, props)

    /**
     * The provided URL, parsed as an object. This is necessary because
     * otherwise `got` will not pay any attention to embedded port numbers.
     * @type {URL}
     */
    const parsedUrl = new URL(url)

    debug('Sending HTTP request to %s...', parsedUrl.href)

    return request
      .post(
        parsedUrl,
        {
          body: this.toString(),
          headers: {
            'content-type': 'application/xml',
            'user-agent': `6-mils@${packageInfo.version}`
          }
        }
      )
      .then(function (response) {
        debug('...response received in %d ms', response.timings.phases.total)
        return new PunchOutSetupResponse(response.body)
      })
      .catch(function (err) {
        debug('...connection error: %s', (err.code || err.statusMessage))
        throw err
      })
  }
}

module.exports = PunchOutSetupRequest

const debug = require('debug')('6-mils:OutboundMessage')
const isPlainObject = require('is-plain-obj')
const merge = require('lodash.merge')
const moment = require('moment')
const nunjucks = require('nunjucks')
const packageInfo = require('../../package.json')
const path = require('path')
const process = require('process')
const request = require('got')
const uid = require('ulid').ulid

const templateEnvironment = nunjucks.configure(path.join(__dirname, '../templates'))

/**
 * `URL` only became available in Node v10. This is included to support Node v8.
 * @type {URL}
 */
const URL = (global.URL || require('whatwg-url').URL)

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
  const time = (new Date()).getTime()
  const processId = process.ppid
  const uniqueId = uid().substring(16)

  return `${time}.${processId}.${uniqueId}`
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

/**
 *
 */
class OutboundMessage {
  constructor (options) {
    options.payloadId = (options.payloadId || '')

    if (options.payloadId.length === 0) {
      options.payloadId = `${getRandomPayloadIdentifier()}@unknown`
    } else if (options.payloadId.toString().startsWith('@')) {
      options.payloadId = `${getRandomPayloadIdentifier()}${options.payloadId}`
    }

    // Populate the default values for each private property.
    _private.set(this, {
      extrinsic: {},
      from: { domain: '', id: '' },
      payloadId: options.payloadId,
      sender: { domain: '', id: '', secret: '', ua: '' },
      templateName: options.template,
      timestamp: '',
      to: { domain: '', id: '' },
      version: '1.2.045'
    })
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

  /**
   * Populates the <From> element in the request envelope.
   *
   * @param {Object}   options   A dictionary with keys "domain" and "id".
   *
   * @return this
   */
  setBuyerInfo (options) {
    const baseProps = _private.get(this)
    baseProps.from = merge(baseProps.from, stringifyValues(options))
    _private.set(this, baseProps)

    return this
  }

  /**
   * Populates the <Extrinsic> element(s) in the request body.
   *
   * @param {Object}   hash   A dictionary of key-value pairs that will be used
   *                          to generate the "<Extrinsic>" elements.
   *
   * @return this
   */
  setExtrinsic (hash) {
    hash = (hash || {})

    if (!isPlainObject(hash)) {
      throw new Error('The "hash" parameter, if provided, must be a plain object.')
    }

    const props = _private.get(this)
    props.extrinsics = hash
    _private.set(this, props)

    return this
  }

  /**
   * Populates the <To> element in the request envelope.
   *
   * @param {Object}   options   A dictionary with keys "domain" and "id".
   *
   * @return this
   */
  setSupplierInfo (options) {
    const baseProps = _private.get(this)
    baseProps.to = merge(baseProps.to, stringifyValues(options))
    _private.set(this, baseProps)

    return this
  }

  /**
   * Populates the <Sender> element in the request envelope.
   *
   * @param {Object}   options   A dictionary with keys "domain", "id",
   *                             "secret", and "ua".
   *
   * @return this
   */
  setSenderInfo (options) {
    const baseProps = _private.get(this)
    baseProps.sender = merge(baseProps.sender, stringifyValues(options))
    _private.set(this, baseProps)

    return this
  }

  /**
   * [generateCxml description]
   * @param  {[type]} props  [description]
   * @param  {[type]} format [description]
   * @return {[type]}        [description]
   */
  _generateCxml (props, format) {
    const baseProps = _private.get(this)

    if (baseProps.sender.ua.length === 0) {
      baseProps.sender.ua = `6-mils@${packageInfo.version}`
      _private.set(this, baseProps)
    }

    const cxml = templateEnvironment.render(baseProps.templateName, merge(props, baseProps))

    /**
     * The template is assumed to be properly formatted to begin with. If
     * no formatting is desired, then any whitespace that exists between tags is
     * removed.
     */
    return (format ? cxml : cxml.replace(/>\s+</g, '><'))
  }

  /**
   * [submitCxml description]
   * @param  {[type]} url   [description]
   * @param  {[type]} props [description]
   * @return {[type]}       [description]
   */
  _sendCxml (url, props) {
    /**
     * The provided URL, parsed as an object. This is necessary because
     * otherwise `got` will not pay any attention to embedded port numbers.
     * @type {URL}
     */
    const parsedUrl = new URL(url)

    debug('Sending HTTP request to %s...', parsedUrl.href)

    /**
     * Update timestamp. This should only be done immediately before the message
     * is sent.
     */
    const baseProps = _private.get(this)
    baseProps.timestamp = moment().local().format()
    _private.set(this, baseProps)

    debug('(timestamp set to %s)', baseProps.timestamp)

    return request
      .post(
        parsedUrl,
        {
          body: this._generateCxml(props),
          headers: {
            'content-type': 'application/xml',
            'user-agent': baseProps.sender.ua
          }
        }
      )
      .then(function (response) {
        debug('...response received in %d ms', response.timings.phases.total)
        return response.body
      })
      .catch(function (err) {
        debug('...connection error: %s', (err.code || err.statusMessage))
        throw err
      })
  }
}

module.exports = OutboundMessage

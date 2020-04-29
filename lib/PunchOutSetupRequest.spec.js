/* eslint-env mocha */

const path = require('path')

const PunchOutSetupResponse = require('./PunchOutSetupResponse.js')

const testsForAllCxmlMessages = require(path.join(__dirname, '../test/shared-unit/cxml.js'))
const testsForOutboundMessages = require(path.join(__dirname, '../test/shared-unit/outbound.js'))

/**
 * Code under test.
 * @type {any}
 */
const T = require('./PunchOutSetupRequest.js')

function getNewInstance (options) {
  return (options ? new T(options) : new T())
}

describe('the "PunchOutSetupRequest" module', function () {
  describe('the common elements for all cXML messages', function () {
    testsForAllCxmlMessages(getNewInstance)
  })

  describe('the common elements for all request messages', function () {
    testsForOutboundMessages(getNewInstance)
  })

  describe('the instance members specific for this class', function () {
    let instance = null

    beforeEach(function () {
      instance = getNewInstance()
    })

    describe('the "buyerCookie" property', function () {
      /**
       * A regular expression that describes the default format for the
       * "buyerCookie" property value.
       * @type {RegExp}
       */
      const BUYER_COOKIE = /^\w+$/

      it('must be read-only', function () {
        const expected = instance.buyerCookie
        instance.buyerCookie = 'something else'
        const actual = instance.buyerCookie

        expect(actual).to.equal(expected)
      })

      it('must return a valid value, if not specified in the constructor', function () {
        const actual = instance.buyerCookie
        expect(actual).to.match(BUYER_COOKIE)
      })

      it('must return a valid value, if a `null` value is specified in the constructor', function () {
        const newInstance = getNewInstance({ buyerCookie: null })
        const actual = newInstance.buyerCookie

        expect(actual).to.match(BUYER_COOKIE)
      })

      it('must return the same value as specified in the constructor', function () {
        const newInstance = getNewInstance({ buyerCookie: 'chocolate-chip' })
        const expected = 'chocolate-chip'
        const actual = newInstance.buyerCookie

        expect(actual).to.equal(expected)
      })
    })

    describe('the "setPostbackUrl" method', function () {
      const ERR_MSG = 'The "url" parameter is required and must not be a non-empty string.'

      it('must exist', function () {
        const expected = 'function'
        const actual = typeof instance.setPostbackUrl

        expect(actual).to.equal(expected)
      })

      it('must throw an error if the parameter value is missing', function () {
        expect(function () { instance.setPostbackUrl() }).to.throw(ERR_MSG)
      })

      it('must throw an error if the parameter value is empty', function () {
        expect(function () { instance.setPostbackUrl('') }).to.throw(ERR_MSG)
      })

      it('must throw an error if called with a value that is not a string', function () {
        expect(function () { instance.setPostbackUrl(new Date()) }).to.throw(ERR_MSG)
      })

      it('must return the same instance of PunchOutSetupRequest', function () {
        const expected = instance
        const actual = instance.setPostbackUrl('https://example.com/postback')

        expect(actual).to.equal(expected)
      })

      it('must populate the "URL" element in the cXML message', function () {
        const expected = new RegExp('<BrowserFormPost><URL>https://example.com/postback</URL></BrowserFormPost>')
        const actual = instance.setPostbackUrl('https://example.com/postback').toString()

        expect(actual).to.match(expected)
      })
    })

    describe('the "submit" method', function () {
      it('must return an instance of PunchOutSetupResponse', function () {
        return instance.submit('%%TEST%%')
          .then(function (response) {
            expect(response).to.be.instanceOf(PunchOutSetupResponse)
          })
      })
    })
  })
})

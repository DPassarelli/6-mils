/* eslint-env mocha */

const path = require('path')

const PunchOutSetupResponse = require('./PunchOutSetupResponse.js')
const commonTests = require(path.join(__dirname, '../test/shared-unit/outbound.js'))

/**
 * Code under test.
 * @type {any}
 */
const T = require('./PunchOutSetupRequest.js')

describe('the "PunchOutSetupRequest" module', function () {
  it('must return an Object that can be constructed', function () {
    expect(function () { return new T() }).to.not.throw()
  })

  describe('the constructor', function () {
    it('must return unique instances', function () {
      const A = new T()
      const B = new T()

      expect(A).to.not.equal(B)
    })
  })

  describe('the common elements for all outbound messages', function () {
    commonTests(T)
  })

  describe('the instance members specific for this class', function () {
    let instance = null

    beforeEach(function () {
      instance = new T()
    })

    describe('buyerCookie', function () {
      /**
       * A regular expression that describes the default format for the
       * "buyerCookie" property value.
       * @type {RegExp}
       */
      const BUYER_COOKIE = /^\w+$/

      it('must be a read-only property', function () {
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
        const newInstance = new T({ buyerCookie: null })
        const actual = newInstance.buyerCookie

        expect(actual).to.match(BUYER_COOKIE)
      })

      it('must return the same value as specified in the constructor', function () {
        const newInstance = new T({ buyerCookie: 'chocolate-chip' })
        const expected = 'chocolate-chip'
        const actual = newInstance.buyerCookie

        expect(actual).to.equal(expected)
      })
    })

    describe('setExtrinsic', function () {
      it('must be a method', function () {
        const expected = 'function'
        const actual = typeof instance.setExtrinsic

        expect(actual).to.equal(expected)
      })

      it('must return the same instance of PunchOutSetupRequest', function () {
        const actual = instance.setExtrinsic()
        expect(actual).to.equal(instance)
      })

      it('must throw an error if called with a value that is not a plain object', function () {
        expect(function () { instance.setExtrinsic(new Date()) }).to.throw('The "exts" parameter, if provided, must be a plain object.')
      })

      it('must populate the "Extrinsic" element(s) in the cXML message', function () {
        const expected = new RegExp('<Extrinsic name="Ext1">Val1</Extrinsic><Extrinsic name="Ext2">Val2</Extrinsic>')
        const actual = instance.setExtrinsic({ Ext1: 'Val1', Ext2: 'Val2' }).toString()

        expect(actual).to.match(expected)
      })

      it('must clear the "Extrinsic" element(s) in the cXML message, if called a second time with no parameter value', function () {
        const expected = new RegExp('<Extrinsic[^>]?>')
        const actual = instance.setExtrinsic({ Ext1: 'Val1', Ext2: 'Val2' }).setExtrinsic().toString()

        expect(actual).not.match(expected)
      })

      it('must clear the "Extrinsic" element(s) in the cXML message, if called with `null`', function () {
        const expected = new RegExp('<Extrinsic[^>]?>')
        const actual = instance.setExtrinsic(null).toString()

        expect(actual).not.match(expected)
      })
    })

    describe('setPostbackUrl', function () {
      const ERR_MSG = 'The "url" parameter is required and must not be a non-empty string.'

      it('must be a method', function () {
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

    describe('submit', function () {
      it('must return an instance of PunchOutSetupResponse', function () {
        return instance.submit('%%TEST%%')
          .then(function (response) {
            expect(response).to.be.instanceOf(PunchOutSetupResponse)
          })
      })
    })
  })

  describe.skip('the control character encoding', function () {
    /**
     * [MALFORMED_VALUE description]
     * @type {String}
     */
    const MALFORMED_VALUE = '"></cXML>bad'

    /**
     * [ESCAPED_VALUE description]
     * @type {String}
     */
    const ESCAPED_VALUE = '&quot;&gt;&lt;/cXML&gt;bad'

    it('must be performed on the value for the "payloadID" attribute', function () {
      const instance = new T({ payloadId: MALFORMED_VALUE })

      const expected = new RegExp(`<cXML.*payloadID="${ESCAPED_VALUE}"[^>]*>`)
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must be performed on the value for the "BuyerCookie" element', function () {
      const instance = new T({ buyerCookie: MALFORMED_VALUE })

      const expected = new RegExp(`<BuyerCookie>${ESCAPED_VALUE}</BuyerCookie>`)
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must be performed on the value for the "domain" attribute on the "From" element', function () {
      const instance = new T().setBuyerInfo({ domain: MALFORMED_VALUE })

      const expected = new RegExp(`<From><Credential domain="${ESCAPED_VALUE}"><Identity></Identity></Credential></From>`)
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must be performed on the value for the "Identity" element under the "From" element', function () {
      const instance = new T().setBuyerInfo({ id: MALFORMED_VALUE })

      const expected = new RegExp(`<From><Credential domain=""><Identity>${ESCAPED_VALUE}</Identity></Credential></From>`)
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must be performed on the value for the "domain" attribute on the "To" element', function () {
      const instance = new T().setSupplierInfo({ domain: MALFORMED_VALUE })

      const expected = new RegExp(`<To><Credential domain="${ESCAPED_VALUE}"><Identity></Identity></Credential></To>`)
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must be performed on the value for the "Identity" element under the "To" element', function () {
      const instance = new T().setSupplierInfo({ id: MALFORMED_VALUE })

      const expected = new RegExp(`<To><Credential domain=""><Identity>${ESCAPED_VALUE}</Identity></Credential></To>`)
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must be performed on the value for the "domain" attribute on the "Sender" element', function () {
      const instance = new T().setSenderInfo({ domain: MALFORMED_VALUE })

      const expected = new RegExp(`<Sender><Credential domain="${ESCAPED_VALUE}"><Identity></Identity><SharedSecret></SharedSecret></Credential><UserAgent>.+</UserAgent></Sender>`)
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must be performed on the value for the "Identity" element under the "Sender" element', function () {
      const instance = new T().setSenderInfo({ id: MALFORMED_VALUE })

      const expected = new RegExp(`<Sender><Credential domain=""><Identity>${ESCAPED_VALUE}</Identity><SharedSecret></SharedSecret></Credential><UserAgent>.+</UserAgent></Sender>`)
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must be performed on the value for the "SharedSecret" element under the "Sender" element', function () {
      const instance = new T().setSenderInfo({ secret: MALFORMED_VALUE })

      const expected = new RegExp(`<Sender><Credential domain=""><Identity></Identity><SharedSecret>${ESCAPED_VALUE}</SharedSecret></Credential><UserAgent>.+</UserAgent></Sender>`)
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must be performed on the value for the "UserAgent" element under the "Sender" element', function () {
      const instance = new T().setSenderInfo({ ua: MALFORMED_VALUE })

      const expected = new RegExp(`<Sender><Credential domain=""><Identity></Identity><SharedSecret></SharedSecret></Credential><UserAgent>${ESCAPED_VALUE}</UserAgent></Sender>`)
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must be performed on the value for the "URL" element under the "BrowserFormPost" element', function () {
      const instance = new T().setPostbackUrl(MALFORMED_VALUE)

      const expected = new RegExp(`<BrowserFormPost><URL>${ESCAPED_VALUE}</URL></BrowserFormPost>`)
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must be performed on the value for the "Extrinsic" elements', function () {
      const instance = new T().setExtrinsic({ Ext1: MALFORMED_VALUE })

      const expected = new RegExp(`<Extrinsic name="Ext1">${ESCAPED_VALUE}</Extrinsic>`)
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })
  })
})

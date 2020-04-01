/* eslint-env mocha */

const PunchOutSetupResponse = require('./PunchOutSetupResponse.js')

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

  describe('the "toString" override', function () {
    const instance = new T()

    it('must return a value that indicates it is XML', function () {
      const expected = /^<\?xml [^?>]+\?>/
      const actual = instance.toString()

      expect(actual).to.match(expected)
    })

    it('must return a value that has the correct XML version and encoding', function () {
      const expected = '<?xml version="1.0" encoding="utf-8"?>'
      const actual = instance.toString().substring(0, expected.length)

      expect(actual).to.equal(expected)
    })

    it('must return a value that indicates it is cXML', function () {
      const expected = /^<\?xml [^?>]+\?><!DOCTYPE cXML SYSTEM "http:\/\/xml\.cxml\.org\/schemas\/cXML\/[1-9]([0-9]+)?\.\d+\.\d+\/cXML\.dtd"><cXML[^>]+>.+<\/cXML>$/
      const actual = instance.toString()

      expect(actual).to.match(expected)
    })

    it('must return all of the XML in a single line (no formatting)', function () {
      const expected = 1
      const numberOfLines = instance.toString().split(/>\s+</g).length
      expect(numberOfLines).to.equal(expected)
    })

    it('must return the XML across multiple line if the "format" option is specified', function () {
      const numberOfLines = instance.toString({ format: true }).split(/>\s+</g).length
      expect(numberOfLines).to.be.greaterThan(1)
    })
  })

  describe('the constructor parameters', function () {
    it('must insert the payload identifier, if fully specified', function () {
      const instance = new T({ payloadId: 'test-test.1.2.3@whoknowswhere' })
      const expected = /<cXML.*payloadID="test-test\.1\.2\.3@whoknowswhere"[^>]*>/
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must insert a unique payload identifier, if only the host is specified', function () {
      const instance = new T({ payloadId: '@whoknowswhere' })
      const expected = /<cXML.*payloadID="\S+@whoknowswhere"[^>]*>/
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must insert a unique payload identifier, if no value is specified', function () {
      const instance = new T({})
      const expected = /<cXML.*payloadID="\S+@unknown"[^>]*>/
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must insert a unique payload identifier, if a `null` value is specified', function () {
      const instance = new T({ payloadId: null })
      const expected = /<cXML.*payloadID="\S+@unknown"[^>]*>/
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must insert the "buyer cookie", if fully specified', function () {
      const instance = new T({ buyerCookie: 'chocolate-chip' })
      const expected = /<BuyerCookie>chocolate-chip<\/BuyerCookie>/
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must insert the "buyer cookie", if no value is specified', function () {
      const instance = new T({})
      const expected = /<BuyerCookie>\S+<\/BuyerCookie>/
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must insert the "buyer cookie", if a `null` value is specified', function () {
      const instance = new T({ buyerCookie: null })
      const expected = /<BuyerCookie>\S+<\/BuyerCookie>/
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })
  })

  describe('the instance members', function () {
    /**
     * To reduce boilerplate code, a shared instance is used for each test,
     * which gets reset before each one.
     * @type {Object}
     */
    let instance = null

    beforeEach(function () {
      instance = new T()
    })

    describe('buyerCookie', function () {
      it('must exist', function () {
        const expected = 'string'
        const actual = typeof instance.buyerCookie

        expect(actual).to.equal(expected)
      })
      it('must return a value, if not specified in the constructor', function () {
        const expected = /\S+/
        const actual = instance.buyerCookie

        expect(actual).to.match(expected)
      })

      it('must return the same value as specified in the constructor', function () {
        const expected = 'chocolate-chip'
        const actual = new T({ buyerCookie: 'chocolate-chip' }).buyerCookie

        expect(actual).to.equal(expected)
      })
    })

    describe('payloadId', function () {
      it('must exist', function () {
        const expected = 'string'
        const actual = typeof instance.payloadId

        expect(actual).to.equal(expected)
      })
      it('must return a value, if not specified in the constructor', function () {
        const expected = /\S+/
        const actual = instance.payloadId

        expect(actual).to.match(expected)
      })

      it('must return the same value as specified in the constructor', function () {
        const expected = 'test.test.1-2-3'
        const actual = new T({ payloadId: 'test.test.1-2-3' }).payloadId

        expect(actual).to.equal(expected)
      })
    })

    describe('setBuyerInfo', function () {
      it('must return the same instance of PunchOutSetupRequest', function () {
        const expected = instance
        const actual = instance.setBuyerInfo()

        expect(actual).to.equal(expected)
      })

      it('must throw an error if called with a value that is not a string', function () {
        expect(function () { instance.setBuyerInfo(new Date()) }).to.throw('The "options" parameter, if provided, must be a plain object.')
      })

      it('must populate the "From" element in the cXML message', function () {
        const expected = new RegExp('<From><Credential domain="%%FROM_DOMAIN%%"><Identity>%%FROM_IDENTITY%%</Identity></Credential></From>')
        const actual = instance.setBuyerInfo({ domain: '%%FROM_DOMAIN%%', id: '%%FROM_IDENTITY%%' }).toString()

        expect(actual).to.match(expected)
      })

      it('must populate the "From" element correctly if called more than once', function () {
        const expected = new RegExp('<From><Credential domain="%%FROM_DOMAIN_2%%"><Identity>%%FROM_IDENTITY_2%%</Identity></Credential></From>')
        const actual = instance.setBuyerInfo({ domain: '%%FROM_DOMAIN%%', id: '%%FROM_IDENTITY%%' }).setBuyerInfo({ domain: '%%FROM_DOMAIN_2%%', id: '%%FROM_IDENTITY_2%%' }).toString()

        expect(actual).to.match(expected)
      })

      it('must convert missing values to empty strings', function () {
        const expected = new RegExp('<From><Credential domain=""><Identity></Identity></Credential></From>')
        const actual = instance.setBuyerInfo({}).toString()

        expect(actual).to.match(expected)
      })

      it('must convert null values to empty strings', function () {
        const expected = new RegExp('<From><Credential domain=""><Identity></Identity></Credential></From>')
        const actual = instance.setBuyerInfo({ domain: null, id: null }).toString()

        expect(actual).to.match(expected)
      })

      it('must convert non-string values to strings', function () {
        const expected = new RegExp('<From><Credential domain="3.14159"><Identity>\\[object Object\\]</Identity></Credential></From>')
        const actual = instance.setBuyerInfo({ domain: 3.14159, id: {} }).toString()

        expect(actual).to.match(expected)
      })

      it('must retain parameter values from previous invocations', function () {
        const expected = new RegExp('<From><Credential domain="%%FROM_DOMAIN%%"><Identity>%%FROM_IDENTITY_2%%</Identity></Credential></From>')
        const actual = instance
          .setBuyerInfo({ domain: '%%FROM_DOMAIN%%', id: '%%FROM_IDENTITY%%' })
          .setBuyerInfo({ id: '%%FROM_IDENTITY_2%%' })
          .toString()

        expect(actual).to.match(expected)
      })
    })

    describe('setSupplierInfo', function () {
      it('must return the same instance of PunchOutSetupRequest', function () {
        const expected = instance
        const actual = instance.setSupplierInfo()

        expect(actual).to.equal(expected)
      })

      it('must throw an error if called with a value that is not a string', function () {
        expect(function () { instance.setSupplierInfo(new Date()) }).to.throw('The "options" parameter, if provided, must be a plain object.')
      })

      it('must populate the "To" element in the cXML message', function () {
        const expected = new RegExp('<To><Credential domain="%%TO_DOMAIN%%"><Identity>%%TO_IDENTITY%%</Identity></Credential></To>')
        const actual = instance.setSupplierInfo({ domain: '%%TO_DOMAIN%%', id: '%%TO_IDENTITY%%' }).toString()

        expect(actual).to.match(expected)
      })

      it('must populate the "To" element correctly if called more than once', function () {
        const expected = new RegExp('<To><Credential domain="%%TO_DOMAIN_2%%"><Identity>%%TO_IDENTITY_2%%</Identity></Credential></To>')
        const actual = instance.setSupplierInfo({ domain: '%%TO_DOMAIN%%', id: '%%TO_IDENTITY%%' }).setSupplierInfo({ domain: '%%TO_DOMAIN_2%%', id: '%%TO_IDENTITY_2%%' }).toString()

        expect(actual).to.match(expected)
      })

      it('must convert missing values to empty strings', function () {
        const expected = new RegExp('<To><Credential domain=""><Identity></Identity></Credential></To>')
        const actual = instance.setSupplierInfo({}).toString()

        expect(actual).to.match(expected)
      })

      it('must convert null values to empty strings', function () {
        const expected = new RegExp('<To><Credential domain=""><Identity></Identity></Credential></To>')
        const actual = instance.setSupplierInfo({ domain: null, id: null }).toString()

        expect(actual).to.match(expected)
      })

      it('must convert non-string values to strings', function () {
        const expected = new RegExp('<To><Credential domain="3.14159"><Identity>\\[object Object\\]</Identity></Credential></To>')
        const actual = instance.setSupplierInfo({ domain: 3.14159, id: {} }).toString()

        expect(actual).to.match(expected)
      })

      it('must retain parameter values from previous invocations', function () {
        const expected = new RegExp('<To><Credential domain="%%TO_DOMAIN%%"><Identity>%%TO_IDENTITY_2%%</Identity></Credential></To>')
        const actual = instance
          .setSupplierInfo({ domain: '%%TO_DOMAIN%%', id: '%%TO_IDENTITY%%' })
          .setSupplierInfo({ id: '%%TO_IDENTITY_2%%' })
          .toString()

        expect(actual).to.match(expected)
      })
    })

    describe('setSenderInfo', function () {
      it('must return the same instance of PunchOutSetupRequest', function () {
        const expected = instance
        const actual = instance.setSenderInfo()

        expect(actual).to.equal(expected)
      })

      it('must throw an error if called with a value that is not a string', function () {
        expect(function () { instance.setSenderInfo(new Date()) }).to.throw('The "options" parameter, if provided, must be a plain object.')
      })

      it('must populate the "Sender" element in the cXML message', function () {
        const expected = new RegExp('<Sender><Credential domain="%%SENDER_DOMAIN%%"><Identity>%%SENDER_IDENTITY%%</Identity><SharedSecret>%%SECRET%%</SharedSecret></Credential><UserAgent>.+</UserAgent></Sender>')
        const actual = instance.setSenderInfo({ domain: '%%SENDER_DOMAIN%%', id: '%%SENDER_IDENTITY%%', secret: '%%SECRET%%' }).toString()

        expect(actual).to.match(expected)
      })

      it('must populate the "Sender" element correctly if called more than once', function () {
        const expected = new RegExp('<Sender><Credential domain="%%SENDER_DOMAIN_2%%"><Identity>%%SENDER_IDENTITY_2%%</Identity><SharedSecret>%%SECRET_2%%</SharedSecret></Credential><UserAgent>.+</UserAgent></Sender>')
        const actual = instance.setSenderInfo({ domain: '%%SENDER_DOMAIN%%', id: '%%SENDER_IDENTITY%%' }).setSenderInfo({ domain: '%%SENDER_DOMAIN_2%%', id: '%%SENDER_IDENTITY_2%%', secret: '%%SECRET_2%%' }).toString()

        expect(actual).to.match(expected)
      })

      it('must convert missing values to empty strings', function () {
        const expected = new RegExp('<Sender><Credential domain=""><Identity></Identity><SharedSecret></SharedSecret></Credential><UserAgent>.+</UserAgent></Sender>')
        const actual = instance.setSenderInfo({}).toString()

        expect(actual).to.match(expected)
      })

      it('must convert non-string values to strings', function () {
        const expected = new RegExp('<Sender><Credential domain="3.14159"><Identity>\\[object Object\\]</Identity><SharedSecret>Symbol\\(TEST\\)</SharedSecret></Credential><UserAgent>.+</UserAgent></Sender>')
        const actual = instance.setSenderInfo({ domain: 3.14159, id: {}, secret: Symbol('TEST') }).toString()

        expect(actual).to.match(expected)
      })

      it('must retain parameter values from previous invocations', function () {
        const expected = new RegExp('<Sender><Credential domain="%%SENDER_DOMAIN%%"><Identity>%%SENDER_IDENTITY_2%%</Identity><SharedSecret>%%SECRET%%</SharedSecret></Credential><UserAgent>.+</UserAgent></Sender>')
        const actual = instance
          .setSenderInfo({ domain: '%%SENDER_DOMAIN%%', id: '%%SENDER_IDENTITY%%', secret: '%%SECRET%%' })
          .setSenderInfo({ id: '%%SENDER_IDENTITY_2%%' })
          .toString()

        expect(actual).to.match(expected)
      })

      it('must reset parameter values if all null values are passed', function () {
        const expected = new RegExp('<Sender><Credential domain=""><Identity></Identity><SharedSecret></SharedSecret></Credential><UserAgent>\\S+</UserAgent></Sender>')
        const actual = instance
          .setSenderInfo({ domain: '%%SENDER_DOMAIN%%', id: '%%SENDER_IDENTITY%%', secret: '%%SECRET%%', ua: '      ' })
          .setSenderInfo({ domain: null, id: null, secret: null, ua: null })
          .toString()

        expect(actual).to.match(expected)
      })
    })

    describe('setExtrinsic', function () {
      it('must return the same instance of PunchOutSetupRequest', function () {
        const expected = instance
        const actual = instance.setExtrinsic()

        expect(actual).to.equal(expected)
      })

      it('must throw an error if called with a value that is not a plain object', function () {
        expect(function () { instance.setExtrinsic(new Date()) }).to.throw('The "dict" parameter, if provided, must be a plain object.')
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
      const ERR_MSG = 'The "url" parameter is required and must not be a non-empty string.'

      it('must throw an error if the parameter value is missing', function () {
        const promised = instance.submit()
        return expect(promised).to.be.rejectedWith(ERR_MSG)
      })

      it('must throw an error if the parameter value is empty', function () {
        const promised = instance.submit('')
        return expect(promised).to.be.rejectedWith(ERR_MSG)
      })

      it('must throw an error if called with a value that is not a string', function () {
        const promised = instance.submit(new Date())
        return expect(promised).to.be.rejectedWith(ERR_MSG)
      })

      it('must return an instance of PunchOutSetupResponse', function () {
        return instance.submit('%%TEST%%')
          .then(function (response) {
            expect(response).to.be.instanceOf(PunchOutSetupResponse)
          })
      })
    })
  })

  describe('the control character encoding', function () {
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

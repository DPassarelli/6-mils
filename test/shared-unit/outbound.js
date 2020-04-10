/* eslint-env mocha */

/**
 * A series of unit tests that are applicable to all outbound cXML message
 * objects.
 *
 * @param  {Function}   T   A constructor for the object under test.
 *
 * @return {undefined}
 */
function CommonTestSuite (T) {
  describe('version', function () {
    const instance = new T()

    it('must be a property', function () {
      const expected = 'string'
      const actual = typeof instance.version

      expect(actual).to.equal(expected)
    })

    it('must be read-only', function () {
      const expected = instance.version

      instance.version = 'something else'

      const actual = instance.version

      expect(actual).to.equal(expected)
    })

    it('must have the expected default value', function () {
      const expected = '1.2.045'
      const actual = instance.version

      expect(actual).to.equal(expected)
    })
  })

  describe('payloadId', function () {
    /**
       * A regular expression that describes the default format for the
       * "payloadId" property value.
       * @type {RegExp}
       */
    const PAYLOAD_ID = /^\d+\.\d+\.\w+@unknown$/

    it('must be a property', function () {
      const instance = new T()
      const expected = 'string'
      const actual = typeof instance.version

      expect(actual).to.equal(expected)
    })

    it('must be read-only', function () {
      const instance = new T()
      const expected = instance.payloadId

      instance.payloadId = 'something else'

      const actual = instance.payloadId

      expect(actual).to.equal(expected)
    })

    it('must return the value passed into the constructor, if fully specified', function () {
      const instance = new T({ payloadId: 'test-test.1.2.3@whoknowswhere' })
      const expected = 'test-test.1.2.3@whoknowswhere'
      const actual = instance.payloadId
      expect(actual).to.equal(expected)
    })

    it('must return a valid value, if only the host is specified in the constructor', function () {
      const instance = new T({ payloadId: '@whoknowswhere' })
      const expected = /\S+@whoknowswhere$/
      const actual = instance.payloadId
      expect(actual).to.match(expected)
    })

    it('must return a valid value, if no value is specified in the constructor', function () {
      const instance = new T({})
      const actual = instance.payloadId
      expect(actual).to.match(PAYLOAD_ID)
    })

    it('must return a valid value, if a `null` value is specified in the constructor', function () {
      const instance = new T({ payloadId: null })
      const actual = instance.payloadId
      expect(actual).to.match(PAYLOAD_ID)
    })
  })

  describe('toString', function () {
    const instance = new T()

    it('must be a method', function () {
      const expected = 'function'
      const actual = typeof instance.toString

      expect(actual).to.equal(expected)
    })

    it('must return a value that indicates it is cXML', function () {
      const expected = /^<\?xml version="1\.0" encoding="utf-8"\?><!DOCTYPE cXML SYSTEM "http:\/\/xml\.cxml\.org\/schemas\/cXML\/[1-9]([0-9]+)?\.\d+\.\d+\/cXML\.dtd"><cXML[^>]+>.+<\/cXML>$/
      const actual = instance.toString()

      expect(actual).to.match(expected)
    })

    it('must return all of the XML in a single line by default)', function () {
      const expected = 1
      const numberOfLines = instance.toString().split(/>\s+</g).length
      expect(numberOfLines).to.equal(expected)
    })

    it('must return the XML across multiple lines if the "format" option is specified', function () {
      const numberOfLines = instance.toString({ format: true }).split(/>\s+</g).length
      expect(numberOfLines).to.be.greaterThan(1)
    })
  })

  describe('setBuyerInfo', function () {
    let instance = null

    beforeEach(function () {
      instance = new T()
    })

    it('must be a method', function () {
      const expected = 'function'
      const actual = typeof instance.setBuyerInfo

      expect(actual).to.equal(expected)
    })

    it('must return itself', function () {
      const actual = instance.setBuyerInfo()
      expect(actual).to.equal(instance)
    })

    it('must throw an error if called with a value that is not a plain object', function () {
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
    let instance = null

    beforeEach(function () {
      instance = new T()
    })

    it('must be a method', function () {
      const expected = 'function'
      const actual = typeof instance.setSupplierInfo

      expect(actual).to.equal(expected)
    })

    it('must return itself', function () {
      const actual = instance.setSupplierInfo()
      expect(actual).to.equal(instance)
    })

    it('must throw an error if called with a value that is not a plain object', function () {
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
    let instance = null

    beforeEach(function () {
      instance = new T()
    })

    it('must be a method', function () {
      const expected = 'function'
      const actual = typeof instance.setSenderInfo

      expect(actual).to.equal(expected)
    })

    it('must return itself', function () {
      const actual = instance.setSenderInfo()
      expect(actual).to.equal(instance)
    })

    it('must throw an error if called with a value that is not a plain object', function () {
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

  describe('submit', function () {
    const ERR_MSG = 'The "url" parameter is required and must not be a non-empty string.'
    let instance = null

    beforeEach(function () {
      instance = new T()
    })

    it('must be an asynchronous method', function (done) {
      instance.submit()
        .then(() => { done() })
        .catch(() => { done() })
    })

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
  })
}

module.exports = CommonTestSuite

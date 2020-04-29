/* eslint-env mocha */

/**
 * A series of unit tests that are applicable to all outbound cXML message
 * objects.
 *
 * @param  {Function}   factory   A factory for creating new instances of the
 *                                class under test.
 *
 * @return {undefined}
 */
function CommonTestSuite (factory) {
  describe('the "payloadId" property', function () {
    /**
       * A regular expression that describes the default format for the
       * "payloadId" property value.
       * @type {RegExp}
       */
    const PAYLOAD_ID = /^\d+\.\d+\.\w+@unknown$/

    it('must return the value passed into the constructor, if fully specified', function () {
      const instance = factory({ payloadId: 'test-test.1.2.3@whoknowswhere' })
      const expected = 'test-test.1.2.3@whoknowswhere'
      const actual = instance.payloadId

      expect(actual).to.equal(expected)
    })

    it('must return a valid value, if only the host is specified in the constructor', function () {
      const instance = factory({ payloadId: '@whoknowswhere' })
      const expected = /\S+@whoknowswhere$/
      const actual = instance.payloadId

      expect(actual).to.match(expected)
    })

    it('must return a valid value, if no value is specified in the constructor', function () {
      const instance = factory({})
      const actual = instance.payloadId

      expect(actual).to.match(PAYLOAD_ID)
    })

    it('must return a valid value, if a `null` value is specified in the constructor', function () {
      const instance = factory({ payloadId: null })
      const actual = instance.payloadId

      expect(actual).to.match(PAYLOAD_ID)
    })
  })

  describe('the "version" property', function () {
    it('must have the correct value', function () {
      const instance = factory()

      const expected = '1.2.045'
      const actual = instance.version

      expect(actual).to.equal(expected)
    })
  })

  describe('the "setBuyerInfo" method', function () {
    let instance = null

    beforeEach(function () {
      instance = factory()
    })

    it('must exist', function () {
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

  describe('the "setSupplierInfo" method', function () {
    let instance = null

    beforeEach(function () {
      instance = factory()
    })

    it('must exist', function () {
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

  describe('the "setSenderInfo" method', function () {
    let instance = null

    beforeEach(function () {
      instance = factory()
    })

    it('must exist', function () {
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

  describe('the "setExtrinsic" method', function () {
    let instance = null

    beforeEach(function () {
      instance = factory()
    })

    it('must exist', function () {
      const expected = 'function'
      const actual = typeof instance.setExtrinsic

      expect(actual).to.equal(expected)
    })

    it('must return itself', function () {
      const actual = instance.setExtrinsic()
      expect(actual).to.equal(instance)
    })

    it('must throw an error if called with a value that is not a plain object', function () {
      expect(function () { instance.setExtrinsic(new Date()) }).to.throw('The "hash" parameter, if provided, must be a plain object.')
    })

    it('must populate the "Extrinsic" element(s) in the cXML message', function () {
      const expected = new RegExp('<Extrinsic name="Ext1">Val1</Extrinsic><Extrinsic name="Ext2">Val2</Extrinsic>')
      const actual = instance.setExtrinsic({ Ext1: 'Val1', Ext2: 'Val2' }).toString()

      expect(actual).to.match(expected)
    })

    it('must clear the "Extrinsic" element(s) in the cXML message, if called a second time with no parameter value', function () {
      const expected = new RegExp('<Extrinsic[^>]?>')
      const actual = instance.setExtrinsic({ Ext1: 'Val1', Ext2: 'Val2' }).setExtrinsic().toString()

      expect(actual).to.not.match(expected)
    })

    it('must clear the "Extrinsic" element(s) in the cXML message, if called with `null`', function () {
      const expected = new RegExp('<Extrinsic[^>]?>')
      const actual = instance.setExtrinsic(null).toString()

      expect(actual).to.not.match(expected)
    })
  })

  describe('the "submit" method', function () {
    const ERR_MSG = 'The "url" parameter is required and must not be a non-empty string.'
    let instance = null

    beforeEach(function () {
      instance = factory()
    })

    it('must be asynchronous', function (done) {
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

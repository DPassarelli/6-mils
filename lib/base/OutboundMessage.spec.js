/* eslint-env mocha */

/**
 * Code under test.
 * @type {any}
 */
const T = require('./OutboundMessage.js')

describe('the "OutboundMessage" module', function () {
  it('must return an object that can be constructed', function () {
    expect(function () { return new T() }).to.not.throw()
  })

  describe('the constructor', function () {
    it('must return unique instances', function () {
      const A = new T()
      const B = new T()

      expect(A).to.not.equal(B)
    })
  })

  describe('the members of each instance', function () {
    describe('the "version" property', function () {
      it('must be read-only', function () {
        const instance = new T()
        const expected = instance.version

        instance.version = 'something else'

        const actual = instance.version

        expect(actual).to.equal(expected)
      })

      it('must have the expected default value', function () {
        const instance = new T()
        const expected = '1.2.045'
        const actual = instance.version

        expect(actual).to.equal(expected)
      })
    })

    describe('the "payloadId" property', function () {
      /**
       * [PAYLOAD_ID description]
       * @type {RegExp}
       */
      const PAYLOAD_ID = /^\d+\.\d+\.\w+@unknown$/

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
  })
})

/* eslint-env mocha */

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

  describe('each instance', function () {
    /**
     * To reduce boilerplate code, a shared instance is used for each test. But
     * it will be reset before each one.
     * @type {Object}
     */
    let instance = null

    beforeEach(function () {
      instance = new T()
    })

    it('must have a "toString" method', function () {
      expect(instance).to.have.property('toString')
      expect(instance.toString).to.be.an.instanceOf(Function)
    })

    describe('the "toString" method', function () {
      it('must return a value that indicates it is XML', function () {
        const expected = '<?xml version="1.0" encoding="utf-8"?>'
        const actual = instance.toString().substring(0, expected.length)

        expect(actual).to.equal(expected)
      })

      it('must return a value that indicates it is cXML', function () {
        const expected = /^<\?xml version="1\.0" encoding="utf-8"\?><!DOCTYPE cXML SYSTEM "http:\/\/xml\.cxml\.org\/schemas\/cXML\/[1-9]([0-9]+)?\.\d+\.\d+\/cXML\.dtd"><cXML[^>]+>.+<\/cXML>$/
        const actual = instance.toString()

        expect(actual).to.match(expected)
      })
    })
  })
})

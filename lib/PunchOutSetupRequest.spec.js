/* eslint-env mocha */

const fs = require('fs')
const path = require('path')
const util = require('util')
const readFileAsync = util.promisify(fs.readFile)

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

      it('must return an empty template if no other methods are called', function () {
        return readFileAsync(path.join(__dirname, '../test/samples/posreq-empty.xml'))
          .then(function (contents) {
            const expected = contents.toString()
            const actual = instance.toString()

            expect(actual).to.equal(expected)
          })
      })

      it('must return an formatted empty template if the "format" option is specified', function () {
        return readFileAsync(path.join(__dirname, '../test/samples/posreq-empty-formatted.xml'))
          .then(function (contents) {
            const expected = contents.toString()
            const actual = instance.toString({ format: true })

            expect(actual).to.equal(expected)
          })
      })
    })

    it('must have a "setBuyerInfo" method', function () {
      expect(instance).to.have.property('toString')
      expect(instance.toString).to.be.an.instanceOf(Function)
    })

    describe('the "setBuyerInfo" method', function () {
      it('must return the same instance of PunchOutSetupRequest', function () {
        const expected = instance
        const actual = instance.setBuyerInfo({ domain: '', id: '' })

        expect(actual).to.equal(expected)
      })

      it('must populate the "From" element in the cXML message', function () {
        const expected = /<From><Credential domain="%%FROM_DOMAIN%%"><Identity>%%FROM_IDENTITY%%<\/Identity><\/Credential><\/From>/
        const actual = instance.setBuyerInfo({ domain: '%%FROM_DOMAIN%%', id: '%%FROM_IDENTITY%%' }).toString()

        expect(actual).to.match(expected)
      })

      it('must populate the "From" element correctly if called more than once', function () {
        const expected = /<From><Credential domain="%%FROM_DOMAIN_2%%"><Identity>%%FROM_IDENTITY_2%%<\/Identity><\/Credential><\/From>/
        const actual = instance.setBuyerInfo({ domain: '%%FROM_DOMAIN%%', id: '%%FROM_IDENTITY%%' }).setBuyerInfo({ domain: '%%FROM_DOMAIN_2%%', id: '%%FROM_IDENTITY_2%%' }).toString()

        expect(actual).to.match(expected)
      })

      it('must convert missing values to empty strings', function () {
        const expected = /<From><Credential domain=""><Identity><\/Identity><\/Credential><\/From>/
        const actual = instance.setBuyerInfo({}).toString()

        expect(actual).to.match(expected)
      })

      it('must convert null values to empty strings', function () {
        const expected = /<From><Credential domain=""><Identity><\/Identity><\/Credential><\/From>/
        const actual = instance.setBuyerInfo({ domain: null, id: null }).toString()

        expect(actual).to.match(expected)
      })

      it('must convert non-string values to strings', function () {
        const expected = /<From><Credential domain="3.14159"><Identity>\[object Object\]<\/Identity><\/Credential><\/From>/
        const actual = instance.setBuyerInfo({ domain: 3.14159, id: {} }).toString()

        expect(actual).to.match(expected)
      })
    })

    it('must have a "setSupplierInfo" method', function () {
      expect(instance).to.have.property('toString')
      expect(instance.toString).to.be.an.instanceOf(Function)
    })

    describe('the "setSupplierInfo" method', function () {
      it('must return the same instance of PunchOutSetupRequest', function () {
        const expected = instance
        const actual = instance.setSupplierInfo({ domain: '', id: '' })

        expect(actual).to.equal(expected)
      })

      it('must populate the "To" element in the cXML message', function () {
        const expected = /<To><Credential domain="%%TO_DOMAIN%%"><Identity>%%TO_IDENTITY%%<\/Identity><\/Credential><\/To>/
        const actual = instance.setSupplierInfo({ domain: '%%TO_DOMAIN%%', id: '%%TO_IDENTITY%%' }).toString()

        expect(actual).to.match(expected)
      })

      it('must populate the "To" element correctly if called more than once', function () {
        const expected = /<To><Credential domain="%%TO_DOMAIN_2%%"><Identity>%%TO_IDENTITY_2%%<\/Identity><\/Credential><\/To>/
        const actual = instance.setSupplierInfo({ domain: '%%TO_DOMAIN%%', id: '%%TO_IDENTITY%%' }).setSupplierInfo({ domain: '%%TO_DOMAIN_2%%', id: '%%TO_IDENTITY_2%%' }).toString()

        expect(actual).to.match(expected)
      })

      it('must convert missing values to empty strings', function () {
        const expected = /<To><Credential domain=""><Identity><\/Identity><\/Credential><\/To>/
        const actual = instance.setSupplierInfo({}).toString()

        expect(actual).to.match(expected)
      })

      it('must convert null values to empty strings', function () {
        const expected = /<To><Credential domain=""><Identity><\/Identity><\/Credential><\/To>/
        const actual = instance.setSupplierInfo({ domain: null, id: null }).toString()

        expect(actual).to.match(expected)
      })

      it('must convert non-string values to strings', function () {
        const expected = /<To><Credential domain="3.14159"><Identity>\[object Object\]<\/Identity><\/Credential><\/To>/
        const actual = instance.setSupplierInfo({ domain: 3.14159, id: {} }).toString()

        expect(actual).to.match(expected)
      })
    })
  })
})

/* eslint-env mocha */

const fs = require('fs')
const path = require('path')
const util = require('util')
const readFileAsync = util.promisify(fs.readFile)

/**
 * [getSampleXml description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
async function getSampleXml (options) {
  options = options || {}
  const filename = (options.format ? '../test/samples/posreq-empty-formatted.xml' : '../test/samples/posreq-empty.xml')

  return readFileAsync(path.join(__dirname, filename))
    .then(function (contents) {
      contents = contents.toString()

      return contents
        .replace(/%%PAYLOAD_ID%%/, (options.payloadId || ''))
        .replace(/%%TIMESTAMP%%/, (options.timestamp || ''))
    })
}

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

    it('must return an empty template if no other methods are called', function () {
      return getSampleXml()
        .then(function (expected) {
          const actual = instance
            .toString()
            .replace(/payloadID="[^"]+"/, 'payloadID=""')
            .replace(/timestamp="[^"]+"/, 'timestamp=""')

          expect(actual).to.equal(expected)
        })
    })

    it('must return an formatted empty template if the "format" option is specified', function () {
      return getSampleXml({ format: true })
        .then(function (expected) {
          const actual = instance
            .toString({ format: true })
            .replace(/payloadID="\S+"/, 'payloadID=""')
            .replace(/timestamp="\S+"/, 'timestamp=""')

          expect(actual).to.equal(expected)
        })
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

    it('must insert the timestamp, if fully specified', function () {
      const instance = new T({ timestamp: '1970-01-01T00:00:00Z' })
      const expected = /<cXML.*timestamp="1970-01-01T00:00:00Z"[^>]*>/
      const actual = instance.toString()
      expect(actual).to.match(expected)
    })

    it('must insert the current timestamp, if not specified', function () {
      const now = new Date()
      const instance = new T({})
      const timestamp = /timestamp="[^"]+"/.exec(instance.toString())[0].replace(/"/g, '')

      const expected = 5 // ms
      const actual = (new Date(timestamp.substring(10))).getTime() - now.getTime()

      expect(actual).to.be.lessThan(expected)
    })
  })

  describe('instance members', function () {
    /**
     * To reduce boilerplate code, a shared instance is used for each test,
     * which gets reset before each one.
     * @type {Object}
     */
    let instance = null

    beforeEach(function () {
      instance = new T()
    })

    describe('setBuyerInfo', function () {
      it('must return the same instance of PunchOutSetupRequest', function () {
        const expected = instance
        const actual = instance.setBuyerInfo()

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

    describe('setSupplierInfo', function () {
      it('must return the same instance of PunchOutSetupRequest', function () {
        const expected = instance
        const actual = instance.setSupplierInfo()

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

/**
 * TODO: add test to check character escaping
 */
})

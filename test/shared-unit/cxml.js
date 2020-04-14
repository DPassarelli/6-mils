/* eslint-env mocha */

const fs = require('fs')
const path = require('path')

/**
 * A series of unit tests that are applicable to all cXML message objects.
 * objects.
 *
 * @param  {Function}   T   A constructor for the object under test.
 *
 * @return {undefined}
 */
function CommonTestSuite (T) {
  let instance = null

  before(function (done) {
    try {
      instance = new T()
      done()
    } catch (e) {
      if (e.message === 'The "cxml" parameter is required and must be well-formed XML.') {
        fs.readFile(path.join(__dirname, `../samples/${T.name}.xml`), function (err, contents) {
          if (err) {
            done(err)
            return
          }

          instance = new T(contents.toString())
          done()
        })
      } else {
        done(e)
      }
    }
  })

  describe('the "version" property', function () {
    it('must exist', function () {
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
  })

  describe('the "payloadId" property', function () {
    it('must exist', function () {
      const expected = 'string'
      const actual = typeof instance.version

      expect(actual).to.equal(expected)
    })

    it('must be read-only', function () {
      const expected = instance.payloadId

      instance.payloadId = 'something else'

      const actual = instance.payloadId

      expect(actual).to.equal(expected)
    })
  })

  describe('the "timestamp" property', function () {
    it('must exist', function () {
      const expected = 'string'
      const actual = typeof instance.version

      expect(actual).to.equal(expected)
    })

    it('must be read-only', function () {
      const expected = instance.timestamp

      instance.timestamp = 'something else'

      const actual = instance.timestamp

      expect(actual).to.equal(expected)
    })
  })

  describe('the "toString" method', function () {
    it('must exist', function () {
      const expected = 'function'
      const actual = typeof instance.toString

      expect(actual).to.equal(expected)
    })

    it('must return a value that indicates it is cXML', function () {
      const expected = /^<\?xml version="1\.0" encoding="(UTF|utf)-8"\?><!DOCTYPE cXML SYSTEM "http:\/\/xml\.cxml\.org\/schemas\/cXML\/[1-9]([0-9]+)?\.\d+\.\d+\/cXML\.dtd"><cXML[^>]+>.+<\/cXML>$/
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
}

module.exports = CommonTestSuite

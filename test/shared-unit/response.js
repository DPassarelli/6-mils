/* eslint-env mocha */

const fs = require('fs')
const path = require('path')

const SAMPLE_CXML = fs.readFileSync(path.join(__dirname, '../samples/PunchOutSetupResponse.xml')).toString()
const FAILED_CXML = fs.readFileSync(path.join(__dirname, '../samples/PunchOutSetupResponse-400.xml')).toString()

/**
 * A series of unit tests that are applicable to all response cXML message
 * objects.
 *
 * @param  {Function}   factory   A factory for creating new instances of the
 *                                class under test.
 *
 * @return {undefined}
 */
function CommonTestSuite (factory) {
  describe('the "statusCode" property', function () {
    const instance = factory(SAMPLE_CXML)

    it('must exist', function () {
      const expected = 'string'
      const actual = typeof instance.statusCode

      expect(actual).to.equal(expected)
    })

    it('must be read-only', function () {
      const expected = instance.statusCode
      instance.statusCode = 'something else'
      const actual = instance.statusCode

      expect(actual).to.equal(expected)
    })
  })

  describe('the "statusText" property', function () {
    const instance = factory(SAMPLE_CXML)

    it('must exist', function () {
      const expected = 'string'
      const actual = typeof instance.statusText

      expect(actual).to.equal(expected)
    })

    it('must be read-only', function () {
      const expected = instance.statusText
      instance.statusText = 'something else'
      const actual = instance.statusText

      expect(actual).to.equal(expected)
    })

    context('for a successful response', function () {
      it('must have the correct value even if something different is specified in the source XML', function () {
        const testInstance = factory(SAMPLE_CXML.replace(/Status code="200" text="success"/, 'Status code="200" text="OK"'))
        const expected = 'success'
        const actual = testInstance.statusText

        expect(actual).to.equal(expected)
      })
    })

    context('for a non-successful response', function () {
      it('must have the correct value if there is no status description in the source XML', function () {
        const testInstance = factory(FAILED_CXML.replace(/<Status code="400" text="Failure">.+<\/Status>/, '<Status code="400" text="Bad request"></Status>'))
        const expected = 'Bad request'
        const actual = testInstance.statusText

        expect(actual).to.equal(expected)
      })

      it('must have the correct value if a status description is specified in the source XML', function () {
        const testInstance = factory(FAILED_CXML)
        const expected = 'XML document contained a doctype but failed validation.'
        const actual = testInstance.statusText

        expect(actual).to.equal(expected)
      })
    })
  })
}

module.exports = CommonTestSuite

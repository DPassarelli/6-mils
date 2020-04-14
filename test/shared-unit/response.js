/* eslint-env mocha */

const fs = require('fs')
const path = require('path')

const SAMPLE_CXML = fs.readFileSync(path.join(__dirname, '../samples/PunchOutSetupResponse.xml')).toString()
const FAILED_CXML = fs.readFileSync(path.join(__dirname, '../samples/PunchOutSetupResponse-400.xml')).toString()

/**
 * A series of unit tests that are applicable to all cXML response message
 * objects.
 *
 * @param  {Function}   T   A constructor for the object under test.
 *
 * @return {undefined}
 */
function CommonTestSuite (T) {
  describe('the "statusCode" property', function () {
    const instance = new T(SAMPLE_CXML)

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
    const instance = new T(SAMPLE_CXML)

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
        const testInstance = new T(SAMPLE_CXML.replace(/Status code="200" text="success"/, 'Status code="200" text="OK"'))
        const expected = 'success'
        const actual = testInstance.statusText

        expect(actual).to.equal(expected)
      })
    })

    context('for a non-successful response', function () {
      it('must have the correct value if there is no status description in the source XML', function () {
        const testInstance = new T(FAILED_CXML.replace(/<Status code="400" text="Failure">.+<\/Status>/, '<Status code="400" text="Bad request"></Status>'))
        const expected = 'Bad request'
        const actual = testInstance.statusText

        expect(actual).to.equal(expected)
      })

      it('must have the correct value if a status description is specified in the source XML', function () {
        const testInstance = new T(FAILED_CXML)
        const expected = 'XML document contained a doctype but failed validation.'
        const actual = testInstance.statusText

        expect(actual).to.equal(expected)
      })
    })
  })
}

module.exports = CommonTestSuite

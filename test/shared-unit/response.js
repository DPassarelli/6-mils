/* eslint-env mocha */

/**
 * A series of unit tests that are applicable to all cXML response message
 * objects.
 *
 * @param  {Function}   T   A constructor for the object under test.
 *
 * @return {undefined}
 */
function CommonTestSuite (T) {
  describe('statusCode', function () {
    const instance = new T()

    it('must be a property', function () {
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

  describe('statusText', function () {
    const instance = new T()

    it('must be a property', function () {
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
        const testInstance = new T('<?xml version="1.0" encoding="UTF-8"?><cXML xml:lang="en-US" payloadID="123ABC" timestamp="2020-04-13T17:13:27+00:00"><Response><Status code="200" text="OK"/></Response></cXML>')
        const expected = 'success'
        const actual = testInstance.statusText

        expect(actual).to.equal(expected)
      })
    })

    context('for a non-successful response', function () {
      it('must have the correct value if there is no status description in the source XML', function () {
        const testInstance = new T('<?xml version="1.0" encoding="UTF-8"?><cXML xml:lang="en-US" payloadID="123ABC" timestamp="2020-04-13T17:13:27+00:00"><Response><Status code="400" text="Bad request"/></Response></cXML>')
        const expected = 'Bad request'
        const actual = testInstance.statusText

        expect(actual).to.equal(expected)
      })

      it('must have the correct value if a status description is specified in the source XML', function () {
        const testInstance = new T('<?xml version="1.0" encoding="UTF-8"?><cXML xml:lang="en-US" payloadID="123ABC" timestamp="2020-04-13T17:13:27+00:00"><Response><Status code="400" text="Bad request"/>The XML request was malformed.</Response></cXML>')
        const expected = 'The XML request was malformed.'
        const actual = testInstance.statusText

        expect(actual).to.equal(expected)
      })
    })
  })
}

module.exports = CommonTestSuite

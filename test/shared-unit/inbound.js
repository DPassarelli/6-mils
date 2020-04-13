/* eslint-env mocha */

/**
 * A series of unit tests that are applicable to all inbound cXML message
 * objects (meaning, objects that are constructed from XML that has been
 * received from an outside source).
 *
 * @param  {Function}   T   A constructor for the object under test.
 *
 * @return {undefined}
 */
function CommonTestSuite (T) {
  describe('the constructor', function () {
    const CTOR_ERR_MESSAGE = 'The "cxml" parameter is required and must be well-formed XML.'

    it('must throw an error if no parameter is provided', function () {
      expect(function () { const instance = new T() }).to.throw(CTOR_ERR_MESSAGE) // eslint-disable-line
    })

    it('must throw an error if an empty string is provided', function () {
      expect(function () { const instance = new T('') }).to.throw(CTOR_ERR_MESSAGE) // eslint-disable-line
    })

    it('must throw an error if malformed XML is provided', function () {
      expect(function () { const instance = new T('<?xml version="1.0"?><cXM L DOCTYPE<</<') }).to.throw(CTOR_ERR_MESSAGE) // eslint-disable-line
    })
  })
}

module.exports = CommonTestSuite

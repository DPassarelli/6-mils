/* eslint-env mocha */

/**
 * A series of unit tests that are applicable to all inbound cXML message
 * objects (meaning, objects that are constructed from XML that has been
 * received from an outside source).
 *
 * @param  {Function}   factory   A factory for creating new instances of the
 *                                class under test.
 *
 * @return {undefined}
 */
function CommonTestSuite (factory) {
  describe('the constructor', function () {
    const CTOR_ERR_MESSAGE = 'The "cxml" parameter is required and must be well-formed XML.'

    it('must throw an error if no parameter is provided', function () {
      expect(factory('undefined')).to.throw(CTOR_ERR_MESSAGE)
    })

    it('must throw an error if an empty string is provided', function () {
      expect(factory('empty-string')).to.throw(CTOR_ERR_MESSAGE)
    })

    it('must throw an error if malformed XML is provided', function () {
      expect(factory('<?xml version="1.0"?><cXM L DOCTYPE<</<')).to.throw(CTOR_ERR_MESSAGE)
    })
  })
}

module.exports = CommonTestSuite

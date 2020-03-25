/* eslint-env mocha */

const is = require('@sindresorhus/is')

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
})

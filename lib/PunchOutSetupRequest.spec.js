/* eslint-env mocha */

const is = require('@sindresorhus/is')

/**
 * Code under test.
 * @type {any}
 */
const T = require('./PunchOutSetupRequest.js')

describe('the "PunchOutSetupRequest" module', function () {
  it('must return an object', function () {
    const expected = 'Object'
    const actual = is(T)

    expect(actual).to.equal(expected)
  })
})

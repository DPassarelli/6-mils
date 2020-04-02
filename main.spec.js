/* eslint-env mocha */

/**
 * Code under test.
 * @type {any}
 */
const T = require('./main.js')

describe('the "main" module', function () {
  it('must return a sealed object', function () {
    expect(T).to.be.sealed // eslint-disable-line

    describe('the exported members', function () {
      it('must include "PunchOutSetupRequest"', function () {
        expect(T).to.have.property('PunchOutSetupRequest')
      })

      it('must include "PunchOutOrderMessage"', function () {
        expect(T).to.have.property('PunchOutOrderMessage')
      })
    })
  })
})

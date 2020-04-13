/* eslint-env mocha */

const path = require('path')

const OrderResponse = require('./OrderResponse.js')

const testsForAllCxmlMessages = require(path.join(__dirname, '../test/shared-unit/cxml.js'))
const testsForOutboundMessages = require(path.join(__dirname, '../test/shared-unit/outbound.js'))

/**
 * Code under test.
 * @type {any}
 */
const T = require('./OrderRequest.js')

describe('the "OrderRequest" module', function () {
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

  describe('the common elements for all cXML messages', function () {
    testsForAllCxmlMessages(T)
  })

  describe('the common elements for all request messages', function () {
    testsForOutboundMessages(T)
  })

  describe('the instance members specific for this class', function () {
    let instance = null

    beforeEach(function () {
      instance = new T()
    })

    describe('submit', function () {
      it('must return an instance of OrderResponse', function () {
        return instance.submit('%%TEST%%')
          .then(function (response) {
            expect(response).to.be.instanceOf(OrderResponse)
          })
      })
    })
  })
})

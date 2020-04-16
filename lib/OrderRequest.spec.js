/* eslint-env mocha */

const moment = require('moment')
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
  describe('the common elements for all cXML messages', function () {
    testsForAllCxmlMessages(T)
  })

  describe('the common elements for all request messages', function () {
    testsForOutboundMessages(T)
  })

  describe('the instance members specific for this class', function () {
    describe('the "orderId" property', function () {
      let instance = null

      beforeEach(function () {
        instance = new T()
      })

      it('must be read/write', function () {
        instance.orderId = 'A'
        expect(instance.orderId).to.equal('A')
      })

      it('must return a blank value, if not specified in the constructor', function () {
        const expected = ''
        const actual = instance.orderId
        expect(actual).to.equal(expected)
      })

      it('must return the same value as specified in the constructor', function () {
        const newInstance = new T({ orderId: '123' })

        const expected = '123'
        const actual = newInstance.orderId

        expect(actual).to.equal(expected)
      })

      it('must return a string value, even if a non-string is specified in the constructor', function () {
        const newInstance = new T({ orderId: { id: '123' } })

        const expected = '[object Object]'
        const actual = newInstance.orderId

        expect(actual).to.equal(expected)
      })

      it('must return a blank value, if set to `null`', function () {
        const expected = ''

        instance.orderId = null

        const actual = instance.orderId

        expect(actual).to.equal(expected)
      })

      it('must return a non-blank value, if set to something falsey', function () {
        const expected = '0'

        instance.orderId = 0

        const actual = instance.orderId

        expect(actual).to.equal(expected)
      })
    })

    describe('the "orderDate" property', function () {
      let instance = null

      beforeEach(function () {
        instance = new T()
      })

      it('must be read-only', function () {
        const expected = instance.orderDate

        instance.orderDate = 'something else'

        const actual = instance.orderDate
        expect(actual).to.equal(expected)
      })

      it('must return a (local) date and time string in ISO8601 format', function () {
        const expected = instance.orderDate
        const actual = moment(instance.orderDate, moment.ISO_8601, true).local().format()
        expect(actual).to.equal(expected)
      })

      it('must return the date and time it was instantiated, if not specified in the constructor', function () {
        const expected = 1000

        const now = new Date()
        const orderDate = new Date(instance.orderDate)

        const actual = now.getTime() - orderDate.getTime()
        expect(actual).to.be.lessThan(expected)
      })

      it('must return the same value as specified in the constructor', function () {
        const newInstance = new T({ orderDate: '2020-04-16T08:49:45-04:00' })

        const expected = '2020-04-16T08:49:45-04:00'
        const actual = newInstance.orderDate

        expect(actual).to.equal(expected)
      })
    })

    describe('the "submit" method', function () {
      it('must throw an error if the "orderId" property is blank', function () {})

      it('must throw an error if the "orderType" property is not one of the allowed values', function () {})

      it('must throw an error if the "requestType" property is not one of the allowed values', function () {})

      it.skip('must return an instance of OrderResponse', function () {
        const instance = new T()

        instance.orderId = 'TEST'

        return instance.submit('%%TEST%%')
          .then(function (response) {
            expect(response).to.be.instanceOf(OrderResponse)
          })
      })
    })
  })
})

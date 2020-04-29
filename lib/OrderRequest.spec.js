/* eslint-env mocha */

const merge = require('lodash.merge')
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

function getNewInstance (options) {
  return new T(merge({ orderId: 'test' }, options))
}

describe('the "OrderRequest" module', function () {
  describe('the common elements for all cXML messages', function () {
    testsForAllCxmlMessages(getNewInstance)
  })

  describe('the common elements for all request messages', function () {
    testsForOutboundMessages(getNewInstance)
  })

  describe('the constructor', function () {
    const CTOR_ERR_MESSAGE = 'The "orderId" property of the "options" parameter is required and must not be blank.'

    it('must throw an error if the "options" parameters is missing', function () {
      expect(function () { const instance = new T() }).to.throw(CTOR_ERR_MESSAGE) // eslint-disable-line
    })

    it('must throw an error if the "options" parameters is provided, but does not include "orderId"', function () {
      expect(function () { const instance = new T({}) }).to.throw(CTOR_ERR_MESSAGE) // eslint-disable-line
    })

    it('must throw an error if the "orderId" property is provided, but is blank', function () {
      expect(function () { const instance = new T({ orderId: '' }) }).to.throw(CTOR_ERR_MESSAGE) // eslint-disable-line
    })

    it('must throw an error if the "orderId" property is provided, but is null', function () {
      expect(function () { const instance = new T({ orderId: null }) }).to.throw(CTOR_ERR_MESSAGE) // eslint-disable-line
    })
  })

  describe('the instance members specific for this class', function () {
    describe('the "orderId" property', function () {
      let instance = null

      beforeEach(function () {
        instance = getNewInstance()
      })

      it('must be read-only', function () {
        const expected = instance.orderId
        instance.orderId = 'A'
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
    })

    describe('the "orderDate" property', function () {
      let instance = null

      beforeEach(function () {
        instance = getNewInstance()
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
        const orderDate = new Date(instance.orderDate)

        const expected = 1000
        const actual = Date.now() - orderDate.getTime()

        expect(actual).to.be.lessThan(expected)
      })

      it('must return the same value as specified in the constructor', function () {
        const newInstance = new T({ orderId: 'test', orderDate: '2020-04-16T08:49:45-04:00' })

        const expected = '2020-04-16T08:49:45-04:00'
        const actual = newInstance.orderDate

        expect(actual).to.equal(expected)
      })
    })

    describe('the "submit" method', function () {
      it('must return an instance of OrderResponse', function () {
        const instance = getNewInstance()

        return instance.submit('%%TEST%%')
          .then(function (response) {
            expect(response).to.be.instanceOf(OrderResponse)
          })
      })
    })
  })
})

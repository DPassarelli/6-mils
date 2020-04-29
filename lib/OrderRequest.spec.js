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

      it('must exist', function () {
        const expected = 'string'
        const actual = typeof instance.orderId

        expect(actual).to.equal(expected)
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

      it('must exist', function () {
        const expected = 'string'
        const actual = typeof instance.orderDate

        expect(actual).to.equal(expected)
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

      it('must return the same value as specified in the constructor (as a string)', function () {
        const newInstance = getNewInstance({ orderDate: '2020-04-16T08:49:45-04:00' })

        const expected = '2020-04-16T08:49:45-04:00'
        const actual = newInstance.orderDate

        expect(actual).to.equal(expected)
      })

      it('must return the same value as specified in the constructor (as a Date)', function () {
        const now = new Date()
        const newInstance = getNewInstance({ orderDate: now })

        const expected = moment(now).local().format()
        const actual = newInstance.orderDate

        expect(actual).to.equal(expected)
      })
    })

    describe('the "orderType" property', function () {
      let instance = null

      beforeEach(function () {
        instance = getNewInstance()
      })

      it('must exist', function () {
        const expected = 'string'
        const actual = typeof instance.orderType

        expect(actual).to.equal(expected)
      })

      it('must be read-only', function () {
        const expected = instance.orderType
        instance.orderType = 'something else'
        const actual = instance.orderType

        expect(actual).to.equal(expected)
      })

      it('must return the value "regular"', function () {
        const expected = 'regular'
        const actual = instance.orderType

        expect(actual).to.equal(expected)
      })
    })

    describe('the "requestType" property', function () {
      let instance = null

      beforeEach(function () {
        instance = getNewInstance()
      })

      it('must exist', function () {
        const expected = 'string'
        const actual = typeof instance.requestType

        expect(actual).to.equal(expected)
      })

      it('must be read-only', function () {
        const expected = instance.requestType
        instance.requestType = 'something else'
        const actual = instance.requestType

        expect(actual).to.equal(expected)
      })

      it('must return the value "new"', function () {
        const expected = 'new'
        const actual = instance.requestType

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

    describe('the "addItem" method', function () {
      let instance = null

      beforeEach(function () {
        instance = getNewInstance()
      })

      it('must exist', function () {
        const expected = 'function'
        const actual = typeof instance.addItem

        expect(actual).to.equal(expected)
      })

      it('must throw an error if "item" is not provided', function () {
        expect(function () { instance.addItem() }).to.throw('When adding an item to the order, "name" is a required property for "item".')
      })

      it('must throw an error if "name" is not provided', function () {
        const item = {
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          uom: 'EA'
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "name" is a required property for "item".')
      })

      it('must throw an error if "quantity" is not provided', function () {
        const item = {
          name: 'test',
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          uom: 'EA'
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "quantity" is a required property for "item" and must be numeric.')
      })

      it('must throw an error if "quantity" is not a number', function () {
        const item = {
          name: 'test',
          quantity: 'one',
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          uom: 'EA'
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "quantity" is a required property for "item" and must be numeric.')
      })

      it('must throw an error if "supplierPartId" is not provided', function () {
        const item = {
          name: 'test',
          quantity: 1,
          unitPrice: 0.99,
          uom: 'EA'
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "supplierPartId" is a required property for "item".')
      })

      it('must throw an error if "unitPrice" is not provided', function () {
        const item = {
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          uom: 'EA'
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "unitPrice" is a required property for "item" and must be numeric.')
      })

      it('must throw an error if "unitPrice" is not a number', function () {
        const item = {
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 'dollar',
          uom: 'EA'
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "unitPrice" is a required property for "item" and must be numeric.')
      })

      it('must throw an error if "uom" is not provided', function () {
        const item = {
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 0.99
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "uom" is a required property for "item".')
      })
    })

    describe('the "addItems" method', function () {
      let instance = null

      beforeEach(function () {
        instance = getNewInstance()
      })

      it('must exist', function () {
        const expected = 'function'
        const actual = typeof instance.addItems

        expect(actual).to.equal(expected)
      })

      it('must throw an error if "items" is not an array', function () {
        const item = {
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          uom: 'EA'
        }

        expect(function () { instance.addItems(item) }).to.throw('The "items" parameter is required and must be an instance of Array.')
      })

      it('must throw an error if "name" is not provided for each item', function () {
        const items = [{
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          uom: 'EA'
        }]

        expect(function () { instance.addItems(items) }).to.throw('When adding an item to the order, "name" is a required property for "item".')
      })

      it('must throw an error if "quantity" is not provided', function () {
        const items = [{
          name: 'test',
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          uom: 'EA'
        }]

        expect(function () { instance.addItems(items) }).to.throw('When adding an item to the order, "quantity" is a required property for "item" and must be numeric.')
      })

      it('must throw an error if "quantity" is not a number', function () {
        const items = [{
          name: 'test',
          quantity: 'one',
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          uom: 'EA'
        }]

        expect(function () { instance.addItems(items) }).to.throw('When adding an item to the order, "quantity" is a required property for "item" and must be numeric.')
      })

      it('must throw an error if "supplierPartId" is not provided', function () {
        const items = [{
          name: 'test',
          quantity: 1,
          unitPrice: 0.99,
          uom: 'EA'
        }]

        expect(function () { instance.addItems(items) }).to.throw('When adding an item to the order, "supplierPartId" is a required property for "item".')
      })

      it('must throw an error if "unitPrice" is not provided', function () {
        const items = [{
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          uom: 'EA'
        }]

        expect(function () { instance.addItems(items) }).to.throw('When adding an item to the order, "unitPrice" is a required property for "item" and must be numeric.')
      })

      it('must throw an error if "unitPrice" is not a number', function () {
        const items = [{
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 'dollar',
          uom: 'EA'
        }]

        expect(function () { instance.addItems(items) }).to.throw('When adding an item to the order, "unitPrice" is a required property for "item" and must be numeric.')
      })

      it('must throw an error if "uom" is not provided', function () {
        const items = [{
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 0.99
        }]

        expect(function () { instance.addItems(items) }).to.throw('When adding an item to the order, "uom" is a required property for "item".')
      })

      it('must return itself', function () {
        const items = [{
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          uom: 'EA'
        }]

        const expected = instance
        const actual = instance.addItems(items)

        expect(actual).to.equal(expected)
      })
    })
  })
})

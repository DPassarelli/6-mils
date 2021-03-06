/* eslint-env mocha */

const DateTime = require('luxon').DateTime
const merge = require('lodash.merge')
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
        const actual = DateTime.fromISO(instance.orderDate).toString()

        expect(actual).to.equal(expected)
      })

      it('must return the date and time it was instantiated, if not specified in the constructor', function () {
        const orderDate = new Date(instance.orderDate)

        const expected = 1000
        const actual = Date.now() - orderDate.getTime()

        expect(actual).to.be.lessThan(expected)
      })

      it('must return the same value as specified in the constructor (as a string)', function () {
        const newInstance = getNewInstance({ orderDate: '2020-04-16T08:49:45-05:00' })

        const expected = '2020-04-16T08:49:45-05:00'
        const actual = newInstance.orderDate

        expect(actual).to.equal(expected)
      })

      it('must return the same value as specified in the constructor (as a Date)', function () {
        const now = new Date()
        const newInstance = getNewInstance({ orderDate: now })

        const expected = DateTime.fromJSDate(now).toString()
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
          currency: 'USD',
          uom: 'EA',
          classification: { test: 'TEST' }
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "name" is a required property for "item".')
      })

      it('must throw an error if "quantity" is not provided', function () {
        const item = {
          name: 'test',
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          currency: 'USD',
          uom: 'EA',
          classification: { test: 'TEST' }
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "quantity" is a required property for "item", and must be numeric.')
      })

      it('must throw an error if "quantity" is not a number', function () {
        const item = {
          name: 'test',
          quantity: 'one',
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          currency: 'USD',
          uom: 'EA',
          classification: { test: 'TEST' }
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "quantity" is a required property for "item", and must be numeric.')
      })

      it('must throw an error if "supplierPartId" is not provided', function () {
        const item = {
          name: 'test',
          quantity: 1,
          unitPrice: 0.99,
          currency: 'USD',
          uom: 'EA',
          classification: { test: 'TEST' }
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "supplierPartId" is a required property for "item".')
      })

      it('must throw an error if "unitPrice" is not provided', function () {
        const item = {
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          currency: 'USD',
          uom: 'EA',
          classification: { test: 'TEST' }
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "unitPrice" is a required property for "item", and must be numeric.')
      })

      it('must throw an error if "unitPrice" is not a number', function () {
        const item = {
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 'dollar',
          currency: 'USD',
          uom: 'EA',
          classification: { test: 'TEST' }
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "unitPrice" is a required property for "item", and must be numeric.')
      })

      it('must throw an error if "currency" is not provided', function () {
        const item = {
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          uom: 'EA',
          classification: { test: 'TEST' }
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "currency" is a required property for "item", and must not be blank.')
      })

      it('must throw an error if "currency" is blank', function () {
        const item = {
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          currency: '',
          uom: 'EA',
          classification: { test: 'TEST' }
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "currency" is a required property for "item", and must not be blank.')
      })

      it('must throw an error if "uom" is not provided', function () {
        const item = {
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          currency: 'USD',
          classification: { test: 'TEST' }
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "uom" is a required property for "item".')
      })

      it('must throw an error if "classification" is not provided', function () {
        const item = {
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          currency: 'USD',
          uom: 'EA'
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "classification" is a required property for "item", and must not be empty.')
      })

      it('must throw an error if "classification" is provided, but empty', function () {
        const item = {
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          currency: 'USD',
          uom: 'EA',
          classification: {}
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "classification" is a required property for "item", and must not be empty.')
      })

      it('must throw an error if "classification" is provided, but is not a plain object', function () {
        const item = {
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          currency: 'USD',
          uom: 'EA',
          classification: 'class'
        }

        expect(function () { instance.addItem(item) }).to.throw('When adding an item to the order, "classification" is a required property for "item", and must not be empty.')
      })

      it('must populate the cXML correctly if all the options are specified', function () {
        instance.addItem({
          name: 'ITEM_NAME',
          quantity: 1,
          supplierPartId: 'ITEM_PART',
          supplierPartAuxId: 'ITEM_AUXID',
          unitPrice: 1.0,
          currency: 'ITEM_CURRENCY',
          uom: 'ITEM_UOM',
          classification: {
            DOM: 'ITEM_CLASS'
          }
        })

        const cxml = `
          <ItemOut quantity="1" lineNumber="1">
            <ItemID>
              <SupplierPartID>ITEM_PART</SupplierPartID>
              <SupplierPartAuxiliaryID>ITEM_AUXID</SupplierPartAuxiliaryID>
            </ItemID>
            <ItemDetail>
              <UnitPrice>
                <Money currency="ITEM_CURRENCY">1</Money>
              </UnitPrice>
              <Description xml:lang="en">ITEM_NAME</Description>
              <UnitOfMeasure>ITEM_UOM</UnitOfMeasure>
              <Classification domain="DOM">ITEM_CLASS</Classification>
            </ItemDetail>
          </ItemOut>`

        const expected = new RegExp(cxml.replace(/\s+</g, '<'))
        const actual = instance.toString()

        expect(actual).to.match(expected)
      })

      it('must populate the cXML correctly if some of the options are specified', function () {
        instance.addItem({
          name: 'ITEM_NAME',
          quantity: 1,
          supplierPartId: 'ITEM_PART',
          unitPrice: 1.0,
          currency: 'ITEM_CURRENCY',
          uom: 'ITEM_UOM',
          classification: { test: 'TEST' }
        })

        const cxml = `
          <ItemOut quantity="1" lineNumber="1">
            <ItemID>
              <SupplierPartID>ITEM_PART</SupplierPartID>
              <SupplierPartAuxiliaryID></SupplierPartAuxiliaryID>
            </ItemID>
            <ItemDetail>
              <UnitPrice>
                <Money currency="ITEM_CURRENCY">1</Money>
              </UnitPrice>
              <Description xml:lang="en">ITEM_NAME</Description>
              <UnitOfMeasure>ITEM_UOM</UnitOfMeasure>
              <Classification domain="test">TEST</Classification>
            </ItemDetail>
          </ItemOut>`

        const expected = new RegExp(cxml.replace(/\s+</g, '<'))
        const actual = instance.toString()

        expect(actual).to.match(expected)
      })

      it('must populate the cXML correctly if called more than once', function () {
        instance.addItem({
          name: 'NAME_1',
          quantity: 1,
          supplierPartId: 'PART_1',
          unitPrice: 1.0,
          currency: 'CURRENCY_1',
          uom: 'UOM_1',
          classification: { test: 'TEST' }
        })

        instance.addItem({
          name: 'NAME_2',
          quantity: 2,
          supplierPartId: 'PART_2',
          unitPrice: 2.0,
          currency: 'CURRENCY_2',
          uom: 'UOM_2',
          classification: { test: 'TEST' }
        })

        const cxml = `
          <ItemOut quantity="1" lineNumber="1">
            <ItemID>
              <SupplierPartID>PART_1</SupplierPartID>
              <SupplierPartAuxiliaryID></SupplierPartAuxiliaryID>
            </ItemID>
            <ItemDetail>
              <UnitPrice>
                <Money currency="CURRENCY_1">1</Money>
              </UnitPrice>
              <Description xml:lang="en">NAME_1</Description>
              <UnitOfMeasure>UOM_1</UnitOfMeasure>
              <Classification domain="test">TEST</Classification>
            </ItemDetail>
          </ItemOut>
          <ItemOut quantity="2" lineNumber="2">
            <ItemID>
              <SupplierPartID>PART_2</SupplierPartID>
              <SupplierPartAuxiliaryID></SupplierPartAuxiliaryID>
            </ItemID>
            <ItemDetail>
              <UnitPrice>
                <Money currency="CURRENCY_2">2</Money>
              </UnitPrice>
              <Description xml:lang="en">NAME_2</Description>
              <UnitOfMeasure>UOM_2</UnitOfMeasure>
              <Classification domain="test">TEST</Classification>
            </ItemDetail>
          </ItemOut>`

        const expected = new RegExp(cxml.replace(/\s+</g, '<'))
        const actual = instance.toString()

        expect(actual).to.match(expected)
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
          currency: 'USD',
          uom: 'EA',
          classification: { test: 'TEST' }
        }

        expect(function () { instance.addItems(item) }).to.throw('The "items" parameter is required and must be an instance of Array.')
      })

      it('must throw an error if "name" is not provided for each item', function () {
        const items = [{
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          currency: 'USD',
          uom: 'EA',
          classification: { test: 'TEST' }
        }]

        expect(function () { instance.addItems(items) }).to.throw('When adding an item to the order, "name" is a required property for "item".')
      })

      it('must throw an error if "quantity" is not provided', function () {
        const items = [{
          name: 'test',
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          currency: 'USD',
          uom: 'EA',
          classification: { test: 'TEST' }
        }]

        expect(function () { instance.addItems(items) }).to.throw('When adding an item to the order, "quantity" is a required property for "item", and must be numeric.')
      })

      it('must throw an error if "quantity" is not a number', function () {
        const items = [{
          name: 'test',
          quantity: 'one',
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          currency: 'USD',
          uom: 'EA',
          classification: { test: 'TEST' }
        }]

        expect(function () { instance.addItems(items) }).to.throw('When adding an item to the order, "quantity" is a required property for "item", and must be numeric.')
      })

      it('must throw an error if "supplierPartId" is not provided', function () {
        const items = [{
          name: 'test',
          quantity: 1,
          unitPrice: 0.99,
          currency: 'USD',
          uom: 'EA',
          classification: { test: 'TEST' }
        }]

        expect(function () { instance.addItems(items) }).to.throw('When adding an item to the order, "supplierPartId" is a required property for "item".')
      })

      it('must throw an error if "unitPrice" is not provided', function () {
        const items = [{
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          currency: 'USD',
          uom: 'EA',
          classification: { test: 'TEST' }
        }]

        expect(function () { instance.addItems(items) }).to.throw('When adding an item to the order, "unitPrice" is a required property for "item", and must be numeric.')
      })

      it('must throw an error if "unitPrice" is not a number', function () {
        const items = [{
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 'dollar',
          currency: 'USD',
          uom: 'EA',
          classification: { test: 'TEST' }
        }]

        expect(function () { instance.addItems(items) }).to.throw('When adding an item to the order, "unitPrice" is a required property for "item", and must be numeric.')
      })

      it('must throw an error if "uom" is not provided', function () {
        const items = [{
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          currency: 'USD',
          classification: { test: 'TEST' }
        }]

        expect(function () { instance.addItems(items) }).to.throw('When adding an item to the order, "uom" is a required property for "item".')
      })

      it('must return itself', function () {
        const items = [{
          name: 'test',
          quantity: 1,
          supplierPartId: 'TEST123',
          unitPrice: 0.99,
          currency: 'USD',
          uom: 'EA',
          classification: { test: 'TEST' }
        }]

        const expected = instance
        const actual = instance.addItems(items)

        expect(actual).to.equal(expected)
      })

      it('must populate the cXML correctly', function () {
        instance.addItems([
          {
            name: 'NAME_1',
            quantity: 1,
            supplierPartId: 'PART_1',
            unitPrice: 1.0,
            currency: 'CURRENCY_1',
            uom: 'UOM_1',
            classification: { test: 'TEST' }
          },
          {
            name: 'NAME_2',
            quantity: 2,
            supplierPartId: 'PART_2',
            unitPrice: 2.0,
            currency: 'CURRENCY_2',
            uom: 'UOM_2',
            classification: { test: 'TEST' }
          }
        ])

        const cxml = `
          <ItemOut quantity="1" lineNumber="1">
            <ItemID>
              <SupplierPartID>PART_1</SupplierPartID>
              <SupplierPartAuxiliaryID></SupplierPartAuxiliaryID>
            </ItemID>
            <ItemDetail>
              <UnitPrice>
                <Money currency="CURRENCY_1">1</Money>
              </UnitPrice>
              <Description xml:lang="en">NAME_1</Description>
              <UnitOfMeasure>UOM_1</UnitOfMeasure>
              <Classification domain="test">TEST</Classification>
            </ItemDetail>
          </ItemOut>
          <ItemOut quantity="2" lineNumber="2">
            <ItemID>
              <SupplierPartID>PART_2</SupplierPartID>
              <SupplierPartAuxiliaryID></SupplierPartAuxiliaryID>
            </ItemID>
            <ItemDetail>
              <UnitPrice>
                <Money currency="CURRENCY_2">2</Money>
              </UnitPrice>
              <Description xml:lang="en">NAME_2</Description>
              <UnitOfMeasure>UOM_2</UnitOfMeasure>
              <Classification domain="test">TEST</Classification>
            </ItemDetail>
          </ItemOut>`

        const expected = new RegExp(cxml.replace(/\s+</g, '<'))
        const actual = instance.toString()

        expect(actual).to.match(expected)
      })
    })

    describe('the "setBillingInfo" method', function () {
      let instance = null

      /**
       * Returns a complete set of valid options for the "setBillingInfo"
       * method.
       * @return {Object}
       */
      function getOptions () {
        return {
          address: {
            id: '123',
            nickname: 'test',
            companyName: 'Acme',
            countryCode: 'US',
            street: '1 Main St',
            city: 'Anytown',
            state: 'ZZ',
            postalCode: '12345',
            countryName: 'United States'
          },
          email: {
            address: 'someone@example.com'
          },
          phone: {
            countryCode: '1',
            areaOrCityCode: '123',
            number: '5551212'
          },
          pcard: {
            number: '4000400040004000',
            expiration: new Date()
          },
          tax: {
            amount: 1.0,
            currency: 'USD'
          }
        }
      }

      beforeEach(function () {
        instance = getNewInstance()
      })

      it('must exist', function () {
        const expected = 'function'
        const actual = typeof instance.setBillingInfo

        expect(actual).to.equal(expected)
      })

      it('must throw an error if no options are provided', function () {
        expect(function () { instance.setBillingInfo() }).to.throw('The "options" parameter is required and must at least contain the "address" property.')
      })

      it('must throw an error if the "address" details are not provided', function () {
        const options = getOptions()
        delete options.address

        expect(function () { instance.setBillingInfo(options) }).to.throw('The "options" parameter is required and must at least contain the "address" property.')
      })

      it('must throw an error if the "address" details are provided, but do not include "companyName"', function () {
        const options = getOptions()
        delete options.address.companyName

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to address must at least contain the "companyName" property, which must not be blank.')
      })

      it('must throw an error if the "address" details are provided, but "companyName" is blank', function () {
        const options = getOptions()
        options.address.companyName = ''

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to address must at least contain the "companyName" property, which must not be blank.')
      })

      it('must throw an error if the "email" details are provided, but do not include "address"', function () {
        const options = getOptions()
        delete options.email.address

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to e-mail must at least contain the "address" property, which must not be blank.')
      })

      it('must throw an error if the "email" details are provided, but "address" is blank', function () {
        const options = getOptions()
        options.email.address = ''

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to e-mail must at least contain the "address" property, which must not be blank.')
      })

      it('must throw an error if the "phone" details are provided, but do not include "countryCode"', function () {
        const options = getOptions()
        delete options.phone.countryCode

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to phone must at least contain the "countryCode", "areaOrCityCode", and "number" properties, which must not be blank.')
      })

      it('must throw an error if the "phone" details are provided, but "countryCode" is blank', function () {
        const options = getOptions()
        options.phone.countryCode = ''

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to phone must at least contain the "countryCode", "areaOrCityCode", and "number" properties, which must not be blank.')
      })

      it('must throw an error if the "pcard" details are provided, but do not include "number"', function () {
        const options = getOptions()
        delete options.pcard.number

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to purchasing card must contain the "number" and "expiration" properties, which must not be blank. "expiration" must be either a string in ISO 8601 format, or an instance of {Date}.')
      })

      it('must throw an error if the "pcard" details are provided, but "number" is blank', function () {
        const options = getOptions()
        options.pcard.number = ''

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to purchasing card must contain the "number" and "expiration" properties, which must not be blank. "expiration" must be either a string in ISO 8601 format, or an instance of {Date}.')
      })

      it('must throw an error if the "pcard" details are provided, but do not include "expiration"', function () {
        const options = getOptions()
        delete options.pcard.expiration

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to purchasing card must contain the "number" and "expiration" properties, which must not be blank. "expiration" must be either a string in ISO 8601 format, or an instance of {Date}.')
      })

      it('must throw an error if the "pcard" details are provided, but "expiration" is blank', function () {
        const options = getOptions()
        options.pcard.expiration = ''

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to purchasing card must contain the "number" and "expiration" properties, which must not be blank. "expiration" must be either a string in ISO 8601 format, or an instance of {Date}.')
      })

      it('must throw an error if the "pcard" details are provided, but "expiration" is neither an instance of Date nor string', function () {
        const options = getOptions()
        options.pcard.expiration = {}

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to purchasing card must contain the "number" and "expiration" properties, which must not be blank. "expiration" must be either a string in ISO 8601 format, or an instance of {Date}.')
      })

      it('must throw an error if the "pcard" details are provided, but "expiration" is not a string in ISO8601 format', function () {
        const options = getOptions()
        options.pcard.expiration = 'Tuesday March 4'

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to purchasing card must contain the "number" and "expiration" properties, which must not be blank. "expiration" must be either a string in ISO 8601 format, or an instance of {Date}.')
      })

      it('must not throw an error if the "pcard" details are provided, and "expiration" is a string in ISO8601 format', function () {
        const options = getOptions()
        options.pcard.expiration = '2020-02-09'

        expect(function () { instance.setBillingInfo(options) }).to.not.throw()
      })

      it('must throw an error if the "tax" details are provided, but do not include "amount"', function () {
        const options = getOptions()
        delete options.tax.amount

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to tax information must contain the "amount" property, which must have a numeric value.')
      })

      it('must throw an error if the "tax" details are provided, but "amount" is not a number', function () {
        const options = getOptions()
        options.tax.amount = 'one'

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to tax information must contain the "amount" property, which must have a numeric value.')
      })

      it('must not throw an error if the "tax" details are provided, and "amount" is zero', function () {
        const options = getOptions()
        options.tax.amount = 0

        expect(function () { instance.setBillingInfo(options) }).to.not.throw()
      })

      it('must throw an error if the "tax" details are provided, but do not include "currency"', function () {
        const options = getOptions()
        delete options.tax.currency

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to tax information must contain the "currency" property, which must not be blank.')
      })

      it('must throw an error if the "tax" details are provided, and "currency" is blank', function () {
        const options = getOptions()
        options.tax.currency = ''

        expect(function () { instance.setBillingInfo(options) }).to.throw('The bill-to tax information must contain the "currency" property, which must not be blank.')
      })

      it('must populate the cXML correctly if all billing address options are specified', function () {
        instance.setBillingInfo({
          address: {
            id: 'ADDRESS_ID',
            countryCode: 'COUNTRY_CODE',
            companyName: 'COMPANY_NAME',
            nickname: 'ADDR_NICK',
            street: 'STREET',
            city: 'CITY',
            state: 'ST',
            postalCode: 'POSTAL_CODE',
            countryName: 'COUNTRY_NAME'
          },
          email: {
            nickname: 'EM_NICK',
            address: 'EMAIL_ADDRESS'
          },
          phone: {
            nickname: 'PH_NICK',
            countryCode: 'PH_CODE',
            areaOrCityCode: 'PH_AREA',
            number: 'PH_NUMBER'
          }
        })

        const cxml = `
          <BillTo>
            <Address addressID="ADDRESS_ID">
              <Name xml:lang="en">COMPANY_NAME</Name>
              <PostalAddress name="ADDR_NICK">
                <Street>STREET</Street>
                <City>CITY</City>
                <State>ST</State>
                <PostalCode>POSTAL_CODE</PostalCode>
                <Country isoCountryCode="COUNTRY_CODE">COUNTRY_NAME</Country>
              </PostalAddress>
              <Email name="EM_NICK">EMAIL_ADDRESS</Email>
              <Phone name="PH_NICK">
                <TelephoneNumber>
                  <CountryCode>PH_CODE</CountryCode>
                  <AreaOrCityCode>PH_AREA</AreaOrCityCode>
                  <Number>PH_NUMBER</Number>
                </TelephoneNumber>
              </Phone>
            </Address>
          </BillTo>`

        const expected = new RegExp(cxml.replace(/\s+</g, '<'))
        const actual = instance.toString()

        expect(actual).to.match(expected)
      })

      it('must populate the cXML correctly if none of the optional billing address info is specified', function () {
        instance.setBillingInfo({
          address: {
            id: '12345',
            companyName: 'Test Corp'
          }
        })

        const cxml = `
          <BillTo>
            <Address addressID="12345">
              <Name xml:lang="en">Test Corp</Name>
            </Address>
          </BillTo>`

        const expected = new RegExp(cxml.replace(/\s+</g, '<'))
        const actual = instance.toString()

        expect(actual).to.match(expected)
      })

      it('must populate the cXML correctly if the pcard options are specified', function () {
        instance.setBillingInfo({
          address: {
            id: '12345',
            companyName: 'Test Corp'
          },
          pcard: {
            number: '4000400040004000',
            expiration: '2025-12-01'
          }
        })

        const cxml = `
          <Payment>
            <PCard number="4000400040004000" expiration="2025-12-31"/>
          </Payment>`

        const expected = new RegExp(cxml.replace(/\s+</g, '<'))
        const actual = instance.toString()

        expect(actual).to.match(expected)
      })

      it('must populate the cXML correctly if none of the optional pcard info is specified', function () {
        instance.setBillingInfo({
          address: {
            id: '12345',
            companyName: 'Test Corp'
          }
        })

        const actual = instance.toString()

        expect(actual).to.not.match(/<Payment>/)
      })

      it('must populate the cXML correctly if the tax options are specified', function () {
        instance.setBillingInfo({
          address: {
            id: '12345',
            companyName: 'Test Corp'
          },
          tax: {
            amount: 0.99,
            currency: 'EUR',
            description: 'VAT'
          }
        })

        const cxml = `
          <Tax>
            <Money currency="EUR">0.99</Money>
            <Description xml:lang="en">VAT</Description>
          </Tax>`

        const expected = new RegExp(cxml.replace(/\s+</g, '<'))
        const actual = instance.toString()

        expect(actual).to.match(expected)
      })

      it('must populate the cXML correctly if none of the optional tax info is specified', function () {
        instance.setBillingInfo({
          address: {
            id: '12345',
            companyName: 'Test Corp'
          }
        })

        const actual = instance.toString()

        expect(actual).to.not.match(/<Tax>/)
      })

      it('must not modify the input value', function () {
        const expected = {
          address: {
            id: '12345',
            companyName: 'Test Corp'
          },
          email: {
            address: 'test@example.com'
          }
        }

        const actual = {
          address: {
            id: '12345',
            companyName: 'Test Corp'
          },
          email: {
            address: 'test@example.com'
          }
        }

        instance.setBillingInfo(actual)

        expect(actual).to.deep.equal(expected)
      })
    })

    describe('the "setShippingInfo" method', function () {
      let instance = null

      /**
       * Returns a complete set of valid options for the "setShippingInfo"
       * method.
       * @return {Object}
       */
      function getOptions () {
        return {
          address: {
            id: '123',
            nickname: 'test',
            companyName: 'Acme',
            countryCode: 'US',
            attentionOf: 'Jane Doe',
            street: '1 Main St',
            city: 'Anytown',
            state: 'ZZ',
            postalCode: '12345',
            countryName: 'United States'
          },
          email: {
            address: 'someone@example.com'
          },
          phone: {
            countryCode: '1',
            areaOrCityCode: '123',
            number: '5551212'
          },
          method: {
            amount: 1.0,
            currency: 'USD',
            description: 'FedEx 3-Day Saver'
          }
        }
      }

      beforeEach(function () {
        instance = getNewInstance()
      })

      it('must exist', function () {
        const expected = 'function'
        const actual = typeof instance.setShippingInfo

        expect(actual).to.equal(expected)
      })

      it('must throw an error if no options are provided', function () {
        expect(function () { instance.setShippingInfo() }).to.throw('The "options" parameter is required and must at least contain the "address" property.')
      })

      it('must throw an error if the "address" details are not provided', function () {
        const options = getOptions()
        delete options.address

        expect(function () { instance.setShippingInfo(options) }).to.throw('The "options" parameter is required and must at least contain the "address" property.')
      })

      it('must throw an error if the "address" details are provided, but do not include "companyName"', function () {
        const options = getOptions()
        delete options.address.companyName

        expect(function () { instance.setShippingInfo(options) }).to.throw('The ship-to address must at least contain the "companyName" and "attentionOf" properties, which must not be blank.')
      })

      it('must throw an error if "companyName" is blank', function () {
        const options = getOptions()
        options.address.companyName = ''

        expect(function () { instance.setShippingInfo(options) }).to.throw('The ship-to address must at least contain the "companyName" and "attentionOf" properties, which must not be blank.')
      })

      it('must throw an error if the "address" details are provided, but do not include "attentionOf"', function () {
        const options = getOptions()
        delete options.address.attentionOf

        expect(function () { instance.setShippingInfo(options) }).to.throw('The ship-to address must at least contain the "companyName" and "attentionOf" properties, which must not be blank.')
      })

      it('must throw an error if "attentionOf" is a blank string', function () {
        const options = getOptions()
        options.address.attentionOf = ''

        expect(function () { instance.setShippingInfo(options) }).to.throw('The ship-to address must at least contain the "companyName" and "attentionOf" properties, which must not be blank.')
      })

      it('must throw an error if "attentionOf" is an empty array', function () {
        const options = getOptions()
        options.address.attentionOf = []

        expect(function () { instance.setShippingInfo(options) }).to.throw('The ship-to address must at least contain the "companyName" and "attentionOf" properties, which must not be blank.')
      })

      it('must throw an error if "attentionOf" is an array of blank strings', function () {
        const options = getOptions()
        options.address.attentionOf = ['']

        expect(function () { instance.setShippingInfo(options) }).to.throw('The ship-to address must at least contain the "companyName" and "attentionOf" properties, which must not be blank.')
      })

      it('must throw an error if the "email" details are provided, but do not include "address"', function () {
        const options = getOptions()
        delete options.email.address

        expect(function () { instance.setShippingInfo(options) }).to.throw('The ship-to e-mail must at least contain the "address" property, which must not be blank.')
      })

      it('must throw an error if the "email" details are provided, but "address" is blank', function () {
        const options = getOptions()
        options.email.address = ''

        expect(function () { instance.setShippingInfo(options) }).to.throw('The ship-to e-mail must at least contain the "address" property, which must not be blank.')
      })

      it('must throw an error if the "phone" details are provided, but do not include "countryCode"', function () {
        const options = getOptions()
        delete options.phone.countryCode

        expect(function () { instance.setShippingInfo(options) }).to.throw('The ship-to phone must at least contain the "countryCode", "areaOrCityCode", and "number" properties, which must not be blank.')
      })

      it('must throw an error if the "phone" details are provided, but "countryCode" is blank', function () {
        const options = getOptions()
        options.phone.countryCode = ''

        expect(function () { instance.setShippingInfo(options) }).to.throw('The ship-to phone must at least contain the "countryCode", "areaOrCityCode", and "number" properties, which must not be blank.')
      })

      it('must throw an error if the "method" details are provided, but do not include "amount"', function () {
        const options = getOptions()
        delete options.method.amount

        expect(function () { instance.setShippingInfo(options) }).to.throw('The ship-to method must contain the "amount" property, which must have a numeric value.')
      })

      it('must throw an error if the "method" details are provided, but "amount" is not a number', function () {
        const options = getOptions()
        options.method.amount = 'one'

        expect(function () { instance.setShippingInfo(options) }).to.throw('The ship-to method must contain the "amount" property, which must have a numeric value.')
      })

      it('must not throw an error if the "method" details are provided, but "amount" is zero', function () {
        const options = getOptions()
        options.method.amount = 0

        expect(function () { instance.setShippingInfo(options) }).to.not.throw()
      })

      it('must populate the cXML correctly if all shipping address options are specified', function () {
        instance.setShippingInfo({
          address: {
            id: 'ADDRESS_ID',
            countryCode: 'COUNTRY_CODE',
            companyName: 'COMPANY_NAME',
            nickname: 'ADDR_NICK',
            attentionOf: ['ATTN_1', 'ATTN_2'],
            street: 'STREET',
            city: 'CITY',
            state: 'ST',
            postalCode: 'POSTAL_CODE',
            countryName: 'COUNTRY_NAME'
          },
          email: {
            nickname: 'EM_NICK',
            address: 'EMAIL_ADDRESS'
          },
          phone: {
            nickname: 'PH_NICK',
            countryCode: 'PH_CODE',
            areaOrCityCode: 'PH_AREA',
            number: 'PH_NUMBER'
          }
        })

        const cxml = `
          <ShipTo>
            <Address addressID="ADDRESS_ID">
              <Name xml:lang="en">COMPANY_NAME</Name>
              <PostalAddress name="ADDR_NICK">
                <DeliverTo>ATTN_1</DeliverTo>
                <DeliverTo>ATTN_2</DeliverTo>
                <Street>STREET</Street>
                <City>CITY</City>
                <State>ST</State>
                <PostalCode>POSTAL_CODE</PostalCode>
                <Country isoCountryCode="COUNTRY_CODE">COUNTRY_NAME</Country>
              </PostalAddress>
              <Email name="EM_NICK">EMAIL_ADDRESS</Email>
              <Phone name="PH_NICK">
                <TelephoneNumber>
                  <CountryCode>PH_CODE</CountryCode>
                  <AreaOrCityCode>PH_AREA</AreaOrCityCode>
                  <Number>PH_NUMBER</Number>
                </TelephoneNumber>
              </Phone>
            </Address>
          </ShipTo>`

        const expected = new RegExp(cxml.replace(/\s+</g, '<'))
        const actual = instance.toString()

        expect(actual).to.match(expected)
      })

      it('must populate the cXML correctly if none of the optional shipping address info is specified', function () {
        instance.setShippingInfo({
          address: {
            id: '12345',
            companyName: 'Acme',
            attentionOf: 'Jane Doe'
          }
        })

        const cxml = `
          <ShipTo>
            <Address addressID="12345">
              <Name xml:lang="en">Acme</Name>
              <PostalAddress name="default">
                <DeliverTo>Jane Doe</DeliverTo>
                <Street></Street>
                <City></City>
                <State></State>
                <PostalCode></PostalCode>
                <Country isoCountryCode=""></Country>
              </PostalAddress>
            </Address>
          </ShipTo>`

        const expected = new RegExp(cxml.replace(/\s+</g, '<'))
        const actual = instance.toString()

        expect(actual).to.match(expected)
      })

      it('must populate the cXML correctly if the shipping method options are specified', function () {
        instance.setShippingInfo({
          address: {
            id: '12345',
            companyName: 'Acme',
            attentionOf: 'Jane Doe'
          },
          method: {
            amount: 12.5,
            currency: 'USD',
            description: 'FedEx 3-Day Saver'
          }
        })

        const cxml = `
          <Shipping>
            <Money currency="USD">12.5</Money>
            <Description xml:lang="en">FedEx 3-Day Saver</Description>
          </Shipping>`

        const expected = new RegExp(cxml.replace(/\s+</g, '<'))
        const actual = instance.toString()

        expect(actual).to.match(expected)
      })

      it('must populate the cXML correctly if none of the shipping method options are specified', function () {
        instance.setShippingInfo({
          address: {
            id: '12345',
            companyName: 'Acme',
            attentionOf: 'Jane Doe'
          }
        })

        const actual = instance.toString()

        expect(actual).to.not.match(/<Shipping>/)
      })

      it('must not modify the input value', function () {
        const expected = {
          address: {
            id: '12345',
            companyName: 'Acme',
            attentionOf: 'Jane Doe'
          },
          email: {
            address: 'test@example.com'
          },
          method: {
            amount: 12.5,
            currency: 'USD'
          }
        }

        const actual = {
          address: {
            id: '12345',
            companyName: 'Acme',
            attentionOf: 'Jane Doe'
          },
          email: {
            address: 'test@example.com'
          },
          method: {
            amount: 12.5,
            currency: 'USD'
          }
        }

        instance.setShippingInfo(actual)

        expect(actual).to.deep.equal(expected)
      })
    })

    describe('the "setTotal" method', function () {
      let instance = null

      beforeEach(function () {
        instance = getNewInstance()
      })

      it('must exist', function () {
        const expected = 'function'
        const actual = typeof instance.setTotal

        expect(actual).to.equal(expected)
      })

      it('must throw an error if no options are specified', function () {
        expect(function () { instance.setTotal() }).to.throw('The total must contain the "amount" property, which must have a numeric value.')
      })

      it('must throw an error if a null value is specified', function () {
        expect(function () { instance.setTotal(null) }).to.throw('The total must contain the "amount" property, which must have a numeric value.')
      })

      it('must throw an error if an empty object is specified', function () {
        expect(function () { instance.setTotal({}) }).to.throw('The total must contain the "amount" property, which must have a numeric value.')
      })

      it('must throw an error if options are specified, but do not include "amount"', function () {
        const options = {
          currency: 'USD'
        }
        expect(function () { instance.setTotal(options) }).to.throw('The total must contain the "amount" property, which must have a numeric value.')
      })

      it('must throw an error if options are specified, but "amount" is not a number', function () {
        const options = {
          amount: 'one',
          currency: 'USD'
        }
        expect(function () { instance.setTotal(options) }).to.throw('The total must contain the "amount" property, which must have a numeric value.')
      })

      it('must throw an error if options are specified, but do not include "currency"', function () {
        const options = {
          amount: 12.5
        }
        expect(function () { instance.setTotal(options) }).to.throw('The total must contain the "currency" property, which must not be blank.')
      })

      it('must throw an error if options are specified, but "currency" is null', function () {
        const options = {
          amount: 12.5,
          currency: null
        }
        expect(function () { instance.setTotal(options) }).to.throw('The total must contain the "currency" property, which must not be blank.')
      })

      it('must throw an error if options are specified, but "currency" is blank', function () {
        const options = {
          amount: 12.5,
          currency: ''
        }
        expect(function () { instance.setTotal(options) }).to.throw('The total must contain the "currency" property, which must not be blank.')
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

      it('must throw an error if the items have mixed currencies, and "setTotal" was not called at all', function () {
        const instance = getNewInstance()

        instance.addItem({
          currency: 'USD',
          name: 'Widget',
          quantity: 1,
          supplierPartId: 'WID001',
          unitPrice: 0.99,
          uom: 'EA',
          classification: { test: 'TEST' }
        })

        instance.addItem({
          currency: 'EUR',
          name: 'Spanner',
          quantity: 1,
          supplierPartId: 'SPAN001',
          unitPrice: 0.99,
          uom: 'EA',
          classification: { test: 'TEST' }
        })

        const promise = instance.submit('%%TEST%%')

        return expect(promise).to.be.rejectedWith('Before submitting the order, "setTotal" must be called if all of the items in the order do not have the same currency.')
      })

      it('must not throw an error if the items all have the same currency, and "setTotal" was not called', function () {
        const instance = getNewInstance()

        instance.addItem({
          currency: 'USD',
          name: 'Widget',
          quantity: 1,
          supplierPartId: 'WID001',
          unitPrice: 0.99,
          uom: 'EA',
          classification: { test: 'TEST' }
        })

        instance.addItem({
          currency: 'USD',
          name: 'Spanner',
          quantity: 1,
          supplierPartId: 'SPAN001',
          unitPrice: 0.99,
          uom: 'EA',
          classification: { test: 'TEST' }
        })

        const promise = instance.submit('%%TEST%%')

        return expect(promise).to.not.be.rejected
      })

      it('must not throw an error if the items have mixed currencies, and "setTotal" was called correctly', function () {
        const instance = getNewInstance()

        instance.addItem({
          currency: 'USD',
          name: 'Widget',
          quantity: 1,
          supplierPartId: 'WID001',
          unitPrice: 0.99,
          uom: 'EA',
          classification: { test: 'TEST' }
        })

        instance.addItem({
          currency: 'USD',
          name: 'Spanner',
          quantity: 1,
          supplierPartId: 'SPAN001',
          unitPrice: 0.99,
          uom: 'EA',
          classification: { test: 'TEST' }
        })

        instance.setTotal({
          amount: 3.12,
          currency: 'USD'
        })

        const promise = instance.submit('%%TEST%%')

        return expect(promise).to.not.be.rejected
      })
    })
  })
})

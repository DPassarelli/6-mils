/* eslint-env mocha */

const path = require('path')

const OrderResponse = require('./OrderResponse.js')
const commonTests = require(path.join(__dirname, '../test/shared-unit/outbound.js'))

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

  describe('the common elements for all outbound messages', function () {
    commonTests(T)
  })

  describe('the instance members specific for this class', function () {
    let instance = null

    beforeEach(function () {
      instance = new T()
    })

    describe.skip('setExtrinsic', function () {
      it('must be a method', function () {
        const expected = 'function'
        const actual = typeof instance.setExtrinsic

        expect(actual).to.equal(expected)
      })

      it('must return the same instance of OrderRequest', function () {
        const actual = instance.setExtrinsic()
        expect(actual).to.equal(instance)
      })

      it('must throw an error if called with a value that is not a plain object', function () {
        expect(function () { instance.setExtrinsic(new Date()) }).to.throw('The "exts" parameter, if provided, must be a plain object.')
      })

      it('must populate the "Extrinsic" element(s) in the cXML message', function () {
        const expected = new RegExp('<Extrinsic name="Ext1">Val1</Extrinsic><Extrinsic name="Ext2">Val2</Extrinsic>')
        const actual = instance.setExtrinsic({ Ext1: 'Val1', Ext2: 'Val2' }).toString()

        expect(actual).to.match(expected)
      })

      it('must clear the "Extrinsic" element(s) in the cXML message, if called a second time with no parameter value', function () {
        const expected = new RegExp('<Extrinsic[^>]?>')
        const actual = instance.setExtrinsic({ Ext1: 'Val1', Ext2: 'Val2' }).setExtrinsic().toString()

        expect(actual).not.match(expected)
      })

      it('must clear the "Extrinsic" element(s) in the cXML message, if called with `null`', function () {
        const expected = new RegExp('<Extrinsic[^>]?>')
        const actual = instance.setExtrinsic(null).toString()

        expect(actual).not.match(expected)
      })
    })

    describe.skip('submit', function () {
      it('must return an instance of OrderResponse', function () {
        return instance.submit('%%TEST%%')
          .then(function (response) {
            expect(response).to.be.instanceOf(OrderResponse)
          })
      })
    })
  })
})

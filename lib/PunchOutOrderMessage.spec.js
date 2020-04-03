/* eslint-env mocha */

const fs = require('fs')
const path = require('path')

/**
 * Code under test.
 * @type {any}
 */
const T = require('./PunchOutOrderMessage.js')

const SAMPLE_CXML = fs.readFileSync(path.join(__dirname, '../test/samples/PunchOutOrderMessage.xml')).toString()

describe('the "PunchOutOrderMessage" module', function () {
  describe('the constructor', function () {
    const CTOR_ERR_MESSAGE = 'The "cxml" parameter is required and must be well-formed XML.'

    it('must throw an error if no parameter is provided', function () {
      expect(function () { const instance = new T() }).to.throw(CTOR_ERR_MESSAGE) // eslint-disable-line
    })

    it('must throw an error if an empty string is provided', function () {
      expect(function () { const instance = new T('') }).to.throw(CTOR_ERR_MESSAGE) // eslint-disable-line
    })

    it('must throw an error if malformed XML is provided', function () {
      expect(function () { const instance = new T('<?xml version="1.0"?><cXM L DOCTYPE<</<') }).to.throw(CTOR_ERR_MESSAGE) // eslint-disable-line
    })
  })

  describe('the instance members', function () {
    /**
     * To reduce boilerplate code, a shared instance is used for each test,
     * which gets reset before each one.
     * @type {Object}
     */
    let instance = null

    beforeEach(function () {
      instance = new T(SAMPLE_CXML)
    })

    describe('version', function () {
      it('must match the value of the specified DOCTYPE', function () {
        const expected = '1.2.014'
        const actual = instance.version

        expect(actual).to.equal(expected)
      })
    })

    describe('payloadId', function () {
      it('must match the value of the specified "payloadID" attribute', function () {
        const expected = '933695160894'
        const actual = instance.payloadId

        expect(actual).to.equal(expected)
      })
    })

    describe('timestamp', function () {
      it('must match the value of the specified "timestamp" attribute', function () {
        const expected = '2002-08-15T08:47:00-07:00'
        const actual = instance.timestamp

        expect(actual).to.equal(expected)
      })
    })

    describe('supplierInfo', function () {
      it('must match the values provided in the "<From>" element', function () {
        const expected = {
          domain: 'DUNS',
          id: '83528721'
        }
        const actual = instance.supplierInfo

        expect(actual).to.deep.equal(expected)
      })
    })

    describe('buyerInfo', function () {
      it('must match the values provided in the "<To>" element', function () {
        const expected = {
          domain: 'DUNS',
          id: '65652314'
        }
        const actual = instance.buyerInfo

        expect(actual).to.deep.equal(expected)
      })
    })

    describe('senderInfo', function () {
      it('must match the values provided in the "<Sender>" element', function () {
        const expected = {
          domain: 'workchairs.com',
          id: 'website 1',
          ua: 'Workchairs cXML Application'
        }
        const actual = instance.senderInfo

        expect(actual).to.deep.equal(expected)
      })
    })

    describe('buyerCookie', function () {
      it('must match the values provided in the "<BuyerCookie>" element', function () {
        const expected = '1CX3L4843PPZO'
        const actual = instance.buyerCookie

        expect(actual).to.equal(expected)
      })
    })

    context('when the PunchOutOrderMessage contains "ItemIn" elements', function () {
      describe('items', function () {
        it('must match the values provided in the "<ItemIn>" element', function () {
          const expected = [
            {
              classification: {
                UNSPSC: '5136030000'
              },
              currency: 'USD',
              description: 'Leather Reclining Desk Chair with Padded Arms',
              name: 'Excelsior Desk Chair',
              quantity: 3,
              supplierPartId: '5555',
              supplierPartAuxId: 'E000028901',
              unitPrice: 254.4,
              uom: 'EA'
            }
          ]
          const actual = instance.items

          expect(actual).to.deep.equal(expected)
        })
      })

      describe('total', function () {
        it('must match the values provided in the "<ItemIn>" element', function () {
          const expected = {
            cost: 763.2,
            currency: 'USD',
            items: 1,
            units: 3
          }

          const actual = instance.total

          expect(actual).to.deep.equal(expected)
        })
      })
    })

    context('when the PunchOutOrderMessage does not contain any "ItemIn" elements', function () {
      const modifiedCxml = SAMPLE_CXML
        .replace(/<ItemIn quantity="\d+">[^]+<\/ItemIn>/, '')
        .replace(/<PunchOutOrderMessageHeader[^>]+>[^]+<\/PunchOutOrderMessageHeader>/, '')

      const newInstance = new T(modifiedCxml)

      describe('items', function () {
        it('must be an empty array', function () {
          const expected = []
          const actual = newInstance.items

          expect(actual).to.deep.equal(expected)
        })
      })

      describe('total', function () {
        it('must have zero values', function () {
          const expected = {
            cost: 0,
            currency: '',
            items: 0,
            units: 0
          }

          const actual = newInstance.total

          expect(actual).to.deep.equal(expected)
        })
      })
    })
  })
})

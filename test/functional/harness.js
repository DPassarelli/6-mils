/* eslint-env mocha */

const validate = require('w3c-xml-validator')

const localServer = require('./lib/local-cxml-server.js')
const getAttributeValue = require('./lib/find-parse-attribute.js')

/**
 * Code under test.
 * @type {any}
 */
const cxml = require('../../main.js')

/**
 * An HTTP server listening on localhost to respond to cXML requests.
 * @type {Object}
 */
let server = null

before((done) => {
  server = localServer()
  server.on('ready', done)
})

after((done) => {
  server.close()
  server.on('closed', done)
})

describe('end-to-end tests', function () {
  this.timeout(10000)

  describe('the PunchOutRequest/Response cycle', function () {
    context('success', function () {
      /**
       * The approximate time (in milliseconds since epoch) that the
       * PunchOutSetupRequest was submitted to the remote server.
       * @type {Number}
       */
      let timeOfSubmission = null

      /**
       * The raw cXML of the order request.
       * @type {String}
       */
      let requestBody = null

      /**
       * The response to the PunchOut setup request.
       * @type {Object}
       */
      let posres = null

      before(() => {
        const posreq = new cxml.PunchOutSetupRequest()

        posreq
          .setBuyerInfo({ domain: 'DUNS', id: '987654' })
          .setSupplierInfo({ domain: 'DUNS', id: '123456' })
          .setSenderInfo({ domain: 'NetworkId', id: 'example.com', secret: 'Open sesame!' })

        server.once('request', (req) => { requestBody = req })

        timeOfSubmission = Date.now()

        return posreq.submit(`${server.baseUrl}/posr/success`)
          .then(function (res) {
            posres = res
          })
      })

      describe('the outgoing request', function () {
        it('must have a valid timestamp', function () {
          /**
           * The timestamp is expected to correspond to when the OrderRequest
           * was sent out.
           */
          const timestamp = new Date(getAttributeValue(requestBody, 'timestamp'))
          const delta = Math.abs(timestamp.getTime() - timeOfSubmission)

          expect(delta).to.be.lessThan(20)
        })

        it('must be well-formed and valid according to the DTD', function () {
          return validate(requestBody)
            .then(function (result) {
              if (!result.isValid) {
                console.error(result.errors)
              }

              expect(result.isValid).to.equal(true)
            })
        })
      })

      describe('the PunchOutSetupResponse object', function () {
        it('must have the correct value for "payloadId"', function () {
          const expected = '933694607739'
          const actual = posres.payloadId

          expect(actual).to.equal(expected)
        })

        it('must have the correct value for "timestamp"', function () {
          const expected = '2002-08-15T08:46:00-07:00'
          const actual = posres.timestamp

          expect(actual).to.equal(expected)
        })

        it('must have the correct value for "version"', function () {
          const expected = '1.2.014'
          const actual = posres.version

          expect(actual).to.equal(expected)
        })

        it('must have the correct value for "statusCode"', function () {
          const expected = '200'
          const actual = posres.statusCode

          expect(actual).to.equal(expected)
        })

        it('must have the correct value for "statusText"', function () {
          const expected = 'success'
          const actual = posres.statusText

          expect(actual).to.equal(expected)
        })
      })
    })

    context('failure', function () {
      describe('the PunchOutSetupResponse object', function () {
        /**
         * The response to the PunchOut setup request.
         * @type {Object}
         */
        let posres = null

        before(() => {
          const posreq = new cxml.PunchOutSetupRequest()

          return posreq
            .setBuyerInfo({ domain: 'DUNS', id: '987654' })
            .setSupplierInfo({ domain: 'DUNS', id: '123456' })
            .setSenderInfo({ domain: 'NetworkId', id: 'example.com', secret: 'Open sesame!' })
            .submit(`${server.baseUrl}/posr/failure`)
            .then(function (res) {
              posres = res
            })
        })

        it('must have the correct value for "payloadId"', function () {
          const expected = '933634634590'
          const actual = posres.payloadId

          expect(actual).to.equal(expected)
        })

        it('must have the correct value for "timestamp"', function () {
          const expected = '2002-08-15T08:48:00-07:00'
          const actual = posres.timestamp

          expect(actual).to.equal(expected)
        })

        it('must have the correct value for "version"', function () {
          const expected = '1.2.014'
          const actual = posres.version

          expect(actual).to.equal(expected)
        })

        it('must have the correct value for "statusCode"', function () {
          const expected = '400'
          const actual = posres.statusCode

          expect(actual).to.equal(expected)
        })

        it('must have the correct value for "statusText"', function () {
          const expected = 'XML document contained a doctype but failed validation.'
          const actual = posres.statusText

          expect(actual).to.equal(expected)
        })
      })
    })

    context('with a timeout', function () {
      it('must be rejected', function (done) {
        /**
           * In order to simulate a timeout, a request is made against an (assumed)
           * unbound port.
           */
        const originalPortNumber = global.parseInt(/\d+$/.exec(server.baseUrl)[0])
        const newBaseUrl = server.baseUrl.replace(originalPortNumber, (originalPortNumber + 1).toString())

        console.log('Submitting timeout request to %s', newBaseUrl)

        const posreq = new cxml.PunchOutSetupRequest()

        posreq
          .setBuyerInfo({ domain: 'DUNS', id: '987654' })
          .setSupplierInfo({ domain: 'DUNS', id: '123456' })
          .setSenderInfo({ domain: 'NetworkId', id: 'example.com', secret: 'Open sesame!' })
          .submit(`${newBaseUrl}/posr/timeout`)
          .then(function (response) {
            done(new Error('The promise was not rejected'))
          })
          .catch(() => { done() })
      })
    })

    context('with an HTTP error', function () {
      it('must be rejected', function (done) {
        const posreq = new cxml.PunchOutSetupRequest()

        posreq
          .setBuyerInfo({ domain: 'DUNS', id: '987654' })
          .setSupplierInfo({ domain: 'DUNS', id: '123456' })
          .setSenderInfo({ domain: 'NetworkId', id: 'example.com', secret: 'Open sesame!' })
          .submit(`${server.baseUrl}/posr/500`)
          .then(function (response) {
            done(new Error('The promise was not rejected'))
          })
          .catch(() => { done() })
      })
    })
  })

  describe('the OrderRequest/Response cycle', function () {
    function OrderRequestFactory () {
      const order = new cxml.OrderRequest({ orderId: 'TEST' })

      order
        .setBuyerInfo({ domain: 'DUNS', id: '987654' })
        .setSupplierInfo({ domain: 'DUNS', id: '123456' })
        .setSenderInfo({ domain: 'NetworkId', id: 'example.com', secret: 'Open sesame!' })

      order.addItem({
        name: 'Test Corp',
        quantity: 1,
        supplierPartId: 'TEST123',
        unitPrice: 0.99,
        currency: 'USD',
        uom: 'EA',
        classification: {
          UNISPEC: 'test-123'
        }
      })

      order.setBillingInfo({
        address: {
          id: '123456',
          companyName: 'Test Corp'
        }
      })

      order.setShippingInfo({
        address: {
          id: '98765',
          nickname: 'test',
          companyName: 'TEST',
          countryCode: 'US',
          attentionOf: 'Test Testor',
          street: '1 Test Rd',
          city: 'Testville',
          state: 'NJ',
          postalCode: '08888',
          countryName: 'United States'
        }
      })

      return order
    }

    context('success', function () {
      /**
       * The approximate time (in milliseconds since epoch) that the
       * OrderRequest was instantiated.
       * @type {Number}
       */
      let timeOfInstantiation = null

      /**
       * The approximate time (in milliseconds since epoch) that the
       * OrderRequest was submitted to the remote server.
       * @type {Number}
       */
      let timeOfSubmission = null

      /**
       * The raw cXML of the order request.
       * @type {String}
       */
      let requestBody = null

      /**
       * The response to the order request.
       * @type {Object}
       */
      let orderResponse = null

      before(() => {
        const order = OrderRequestFactory()
        timeOfInstantiation = Date.now()

        server.once('request', (req) => { requestBody = req })

        timeOfSubmission = Date.now()
        return order.submit(`${server.baseUrl}/order/success`)
          .then(function (res) {
            orderResponse = res
          })
      })

      describe('the outgoing request', function () {
        it('must have a valid timestamp', function () {
          /**
           * The timestamp is expected to correspond to when the OrderRequest
           * was sent out.
           */
          const timestamp = new Date(getAttributeValue(requestBody, 'timestamp'))
          const delta = Math.abs(timestamp.getTime() - timeOfSubmission)

          expect(delta).to.be.lessThan(20)
        })

        it('must have a valid order date', function () {
          /**
           * Since the order date was not specified in the construction of this
           * instance, the value should have been automatically populated when
           * the OrderRequest was instantiated.
           */
          const orderDate = new Date(getAttributeValue(requestBody, 'orderDate'))
          const delta = Math.abs(orderDate.getTime() - timeOfInstantiation)

          expect(delta).to.be.lessThan(20)
        })

        it('must be well-formed and valid according to the DTD', function () {
          return validate(requestBody)
            .then(function (result) {
              if (!result.isValid) {
                console.error(result.errors)
              }

              expect(result.isValid).to.equal(true)
            })
        })
      })

      describe('the OrderResponse object', function () {
        it('must have the correct value for "payloadId"', function () {
          const expected = 'successful.order@test.com'
          const actual = orderResponse.payloadId

          expect(actual).to.equal(expected)
        })

        it('must have the correct value for "timestamp"', function () {
          const expected = '2019-03-12T18:39:09-08:00'
          const actual = orderResponse.timestamp

          expect(actual).to.equal(expected)
        })

        it('must have the correct value for "version"', function () {
          const expected = '1.2.011'
          const actual = orderResponse.version

          expect(actual).to.equal(expected)
        })

        it('must have the correct value for "statusCode"', function () {
          const expected = '200'
          const actual = orderResponse.statusCode

          expect(actual).to.equal(expected)
        })

        it('must have the correct value for "statusText"', function () {
          const expected = 'success'
          const actual = orderResponse.statusText

          expect(actual).to.equal(expected)
        })
      })
    })

    context('empty', function () {
      /**
       * The response to the order request.
       * @type {Object}
       */
      let orderResponse = null

      /**
       * The approximate time (in milliseconds since epoch) that the
       * OrderResponse was received from the remote server.
       * @type {Number}
       */
      let timeOfResponse = null

      /**
       * A regular expression that describes the default format for the
       * "payloadId" property value.
       * @type {RegExp}
       */
      const PAYLOAD_ID = /^\d+\.\d+\.\w+@6-mils$/

      before(() => {
        const order = OrderRequestFactory()

        return order.submit(`${server.baseUrl}/order/empty`)
          .then(function (res) {
            timeOfResponse = Date.now()
            orderResponse = res
          })
      })

      describe('the OrderResponse object', function () {
        it('must have the correct value for "payloadId"', function () {
          expect(orderResponse.payloadId).to.match(PAYLOAD_ID)
        })

        it('must have a valid timestamp', function () {
          /**
           * The timestamp is expected to correspond to when the OrderResponse
           * was sent out.
           */
          const timestamp = new Date(orderResponse.timestamp)
          const delta = Math.abs(timestamp.getTime() - timeOfResponse)

          expect(delta).to.be.lessThan(20)
        })

        it('must have the correct value for "version"', function () {
          const expected = '1.2.045'
          const actual = orderResponse.version

          expect(actual).to.equal(expected)
        })

        it('must have the correct value for "statusCode"', function () {
          const expected = '200'
          const actual = orderResponse.statusCode

          expect(actual).to.equal(expected)
        })

        it('must have the correct value for "statusText"', function () {
          const expected = 'success'
          const actual = orderResponse.statusText

          expect(actual).to.equal(expected)
        })
      })
    })
  })
})

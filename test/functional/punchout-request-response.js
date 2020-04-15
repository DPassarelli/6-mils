/* eslint-env mocha */

const debug = require('debug')('6-mils:func-test')
const fs = require('fs')
const http = require('http')
const path = require('path')

/**
 * Code under test.
 * @type {any}
 */
const cxml = require('../../main.js')

/**
 * The contents of a successful cXML response.
 * @type {String}
 */
const POSR_SUCCESS_CONTENT = fs.readFileSync(path.join(__dirname, '../samples/PunchOutSetupResponse.xml')).toString()

/**
 * The contents of a failed (non-successful) cXML response.
 * @type {String}
 */
const POSR_FAILURE_CONTENT = fs.readFileSync(path.join(__dirname, '../samples/PunchOutSetupResponse-400.xml')).toString()

/**
 * A local HTTP server that will respond to PunchOutSetupRequests.
 * @type {Object}
 */
let localHttpServer = null

/**
 * The system-assigned port that the local HTTP server will be listening on.
 * @type {Number}
 */
let ASSIGNED_PORT = 0

/**
 * A list of all requests captured by the test listener.
 * @type {Array}
 */
const requests = []

/**
 * TEST SETUP
 */
before(function () {
  localHttpServer = http.createServer((req, res) => {
    const requestBody = []

    req.on('data', (chunk) => { requestBody.push(chunk) })

    req.on('end', () => {
      requests.push(requestBody)

      switch (req.url) {
        case '/posr/success':
          debug('replying with successful XML response')
          res.setHeader('content-type', 'application/xml')
          res.end(POSR_SUCCESS_CONTENT)
          break

        case '/posr/failure':
          debug('replying with failed XML response')
          res.setHeader('content-type', 'application/xml')
          res.end(POSR_FAILURE_CONTENT)
          break

        default:
          res.statusCode = parseInt(/\d+/.exec(req.url)[0], 10)
          debug('replying with code %d', res.statusCode)
          res.end()
      }
    })
  })

  localHttpServer.listen(0, '127.0.0.1', () => {
    ASSIGNED_PORT = localHttpServer.address().port
    debug('LOCAL TEST SERVER LISTENING ON http://%s:%d', localHttpServer.address().address, ASSIGNED_PORT)
  })
})

after(function (done) {
  localHttpServer.on('close', () => { debug('LOCAL TEST SERVER CLOSED'); done() })
  localHttpServer.close()
})

/**
 * TESTS
 */
describe('the PunchOut Request/Response cycle', function () {
  context('with a successful response', function () {
    it('must be fulfilled', function () {
      const posreq = new cxml.PunchOutSetupRequest()

      return posreq
        .setBuyerInfo({ domain: 'DUNS', id: '987654' })
        .setSupplierInfo({ domain: 'DUNS', id: '123456' })
        .setSenderInfo({ domain: 'NetworkId', id: 'example.com', secret: 'Open sesame!' })
        .submit(`http://localhost:${ASSIGNED_PORT}/posr/success`)
        .then(function (response) {
          /**
           * Verify the common property values.
           */
          expect(response.payloadId).to.equal('933694607739')
          expect(response.timestamp).to.equal('2002-08-15T08:46:00-07:00')
          expect(response.version).to.equal('1.2.014')

          /**
           * Verify that the response contains the correct status code and text.
           */
          expect(response.statusCode).to.equal('200')
          expect(response.statusText).to.equal('success')

          /**
           * Verify that the response contains the correct URL to redirect to.
           */
          expect(response.url).to.equal('http://xml.workchairs.com/retrieve?reqUrl=20626;Initial=TRUE')

          /**
           * Verify that the original request has the correct timestamp.
           */
          const requestBody = requests.pop()
          const timestamp = new Date(/timestamp="[^"]+/.exec(requestBody)[0].substring(11))
          const now = new Date()
          const diffInMilliseconds = now.getTime() - timestamp.getTime()

          expect(diffInMilliseconds).to.be.lessThan(1200)
        })
    })
  })

  context('with a failed response', function () {
    it('must be fulfilled', function () {
      const posreq = new cxml.PunchOutSetupRequest()

      return posreq
        .setBuyerInfo({ domain: 'DUNS', id: '987654' })
        .setSupplierInfo({ domain: 'DUNS', id: '123456' })
        .setSenderInfo({ domain: 'NetworkId', id: 'example.com', secret: 'Open sesame!' })
        .submit(`http://localhost:${ASSIGNED_PORT}/posr/failure`)
        .then(function (response) {
          /**
           * Verify the common property values.
           */
          expect(response.payloadId).to.equal('933634634590')
          expect(response.timestamp).to.equal('2002-08-15T08:48:00-07:00')
          expect(response.version).to.equal('1.2.014')

          /**
           * Verify that the response contains the correct status code and text.
           */
          expect(response.statusCode).to.equal('400')
          expect(response.statusText).to.equal('XML document contained a doctype but failed validation.')

          /**
           * Verify that the response contains a blank URL.
           */
          expect(response.url).to.be.undefined // eslint-disable-line

          /**
           * Verify that the original request has the correct timestamp.
           */
          const requestBody = requests.pop()
          const timestamp = new Date(/timestamp="[^"]+/.exec(requestBody)[0].substring(11))
          const now = new Date()
          const diffInMilliseconds = now.getTime() - timestamp.getTime()

          expect(diffInMilliseconds).to.be.lessThan(1200)
        })
    })
  })

  context('with a failed HTTP connection', function () {
    it('must be rejected', function (done) {
      /**
       * This test must not timeout before the socket.
       */
      this.timeout(5000)

      const posreq = new cxml.PunchOutSetupRequest()

      posreq
        .setBuyerInfo({ domain: 'DUNS', id: '987654' })
        .setSupplierInfo({ domain: 'DUNS', id: '123456' })
        .setSenderInfo({ domain: 'NetworkId', id: 'example.com', secret: 'Open sesame!' })
        .submit(`http://localhost:${ASSIGNED_PORT + 1}/posr/timeout`)
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
        .submit(`http://localhost:${ASSIGNED_PORT}/posr/500`)
        .then(function (response) {
          done(new Error('The promise was not rejected'))
        })
        .catch(() => { done() })
    })
  })
})

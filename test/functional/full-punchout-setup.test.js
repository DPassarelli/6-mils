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

let server = null
let ASSIGNED_PORT = 0

/**
 * A list of all requests captured by the test listener.
 * @type {Array}
 */
const requests = []

before(function () {
  server = http.createServer((req, res) => {
    switch (req.url) {
      case '/posr/success':
        res.setHeader('content-type', 'application/xml')
        fs.createReadStream(path.join(__dirname, '../samples/PunchOutSetupResponse-200.xml')).pipe(res)
        res.end()
        break

      default:
        res.end(/\d+/.exec(req.url)[0])
    }
  })
  server.listen(0, '127.0.0.1', () => { ASSIGNED_PORT = server.address().port; debug('LOCAL TEST SERVER LISTENING ON', JSON.stringify(server.address())) })
})

after(function (done) {
  server.on('close', () => { console.log('LOCAL TEST SERVER CLOSED'); done() })
  server.close()
})

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
          debug('%j', response)
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

          expect(diffInMilliseconds).to.be.lessThan(1000)
        })
    })
  })

  context('with a failed HTTP connection', function () {
    it('must be rejected', function (done) {
      const posreq = new cxml.PunchOutSetupRequest()

      posreq
        .setBuyerInfo({ domain: 'DUNS', id: '987654' })
        .setSupplierInfo({ domain: 'DUNS', id: '123456' })
        .setSenderInfo({ domain: 'NetworkId', id: 'example.com', secret: 'Open sesame!' })
        .submit(`http://localhost:${ASSIGNED_PORT + 1}/posr/timeout`)
        .then(function (response) {
          done(new Error('The promise was not rejected'))
        })
        .catch(function (err) {
          console.log(err)
          done()
        })
    })
  })
})

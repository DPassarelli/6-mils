/* eslint-env mocha */

const nock = require('nock')
const path = require('path')

/**
 * Code under test.
 * @type {any}
 */
const cxml = require('../../main.js')

/**
 * A list of all requests captured by `nock`. This will allow the test to
 * include assertions against the request in addition to the response.
 * @type {Array}
 */
const requests = []

/**
 * Which outgoing HTTP requests that will be intercepted. This is needed to
 * hook into the `request` event, which allows the intercepted request to be
 * captured for further analysis.
 * @type {Object}
 */
let scope = null

describe('the PunchOut Request/Response cycle', function () {
  before(function () {
    scope = nock('http://cxml.org')
      .post('/posr/success')
      .replyWithFile(
        200,
        path.join(__dirname, '../samples/PunchOutSetupResponse-200.xml'),
        {
          'content-type': 'application/xml'
        }
      )
      .persist()

    scope.on('request', (request, interceptor, body) => {
      requests.push(body)
    })
  })

  after(function () {
    nock.cleanAll()
    nock.restore()
  })

  it('must work when a successful response is received', function () {
    const posreq = new cxml.PunchOutSetupRequest()

    return posreq
      .setBuyerInfo({ domain: 'DUNS', id: '987654' })
      .setSupplierInfo({ domain: 'DUNS', id: '123456' })
      .setSenderInfo({ domain: 'NetworkId', id: 'example.com', secret: 'Open sesame!' })
      .submit('http://cxml.org/posr/success')
      .then(function (response) {
        /**
         * Verify that the response contains the correct status code and text.
         */
        expect(response.statusCode).to.equal('200')
        expect(response.statusText).to.equal('success')

        /**
         * Verify that the original request has the correct timestamp.
         */
        const requestBody = requests.pop()
        const timestamp = new Date(/timestamp="[^"]+/.exec(requestBody)[0].substring(11))
        const now = new Date()
        const diffInMilliseconds = now.getTime() - timestamp.getTime()

        expect(diffInMilliseconds).to.be.lessThan(1000)

        /**
         * Verify that the response contains the correct URL to redirect to.
         */
        expect(response.url).to.equal('http://xml.workchairs.com/retrieve?reqUrl=20626;Initial=TRUE')
      })
  })
})

/* eslint-env mocha */

const nock = require('nock')
const path = require('path')

/**
 * Code under test.
 * @type {any}
 */
const cxml = require('../../main.js')

describe('the PunchOut Request/Response cycle', function () {
  before(function () {
    nock('http://cxml.org')
      .post('/posr/success')
      .replyWithFile(
        200,
        path.join(__dirname, '../samples/PunchOutSetupResponse-200.xml'),
        {
          'content-type': 'application/xml'
        }
      )
      .persist()
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
         * Status
         */
        expect(response.statusCode).to.equal('200')
        expect(response.statusText).to.equal('success')

        /**
         * Timestamp
         */
        // const now = new Date()
        // const timestamp = new Date(response.timestamp)
        // const diffInMilliseconds = now.getTime() - timestamp.getTime()

        // expect(diffInMilliseconds).to.be.lessThan(5)

        /**
         * URL
         */
        expect(response.url).to.equal('http://xml.workchairs.com/retrieve?reqUrl=20626;Initial=TRUE')
      })
  })
})

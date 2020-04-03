/* eslint-env mocha */

/**
 * Code under test.
 * @type {any}
 */
const cxml = require('../../main.js')

describe('the PunchOut Request/Response cycle', function () {
  it('must work when a successful response is received', function () {
    const posreq = new cxml.PunchOutSetupRequest({ payloadId: '@example.com' })

    return posreq
      .setBuyerInfo({ domain: 'DUNS', id: '987654' })
      .setSupplierInfo({ domain: 'DUNS', id: '123456' })
      .setSenderInfo({ domain: 'NetworkId', id: 'example.com', secret: 'Open sesame!' })
  })
})

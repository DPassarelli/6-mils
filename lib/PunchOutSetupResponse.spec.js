/* eslint-env mocha */

const fs = require('fs')
const path = require('path')

/**
 * Code under test.
 * @type {any}
 */
const T = require('./PunchOutSetupResponse.js')

describe('the "PunchOutSetupResponse" module', function () {
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

  describe('the instance members', function () {
    /**
     * To reduce boilerplate code, a shared instance is used for each test,
     * which gets reset before each one.
     * @type {Object}
     */
    let instance = null

    let sourceXml = null

    before(function (done) {
      fs.readFile(path.join(__dirname, '../test/samples/PunchOutSetupResponse-200.xml'), function (err, contents) {
        if (err) {
          done(err)
          return
        }

        sourceXml = contents.toString()
        instance = new T(sourceXml)
        done()
      })
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
        const expected = '933694607739'
        const actual = instance.payloadId

        expect(actual).to.equal(expected)
      })
    })

    describe('statusCode', function () {
      it('must match the value of the specified "code" attribute', function () {
        const expected = '200'
        const actual = instance.statusCode

        expect(actual).to.equal(expected)
      })
    })

    describe('statusText', function () {
      it('must match the value of the specified "text" attribute', function () {
        const expected = 'success'
        const actual = instance.statusText

        expect(actual).to.equal(expected)
      })
    })

    describe('timestamp', function () {
      it('must match the value of the specified "timestamp" attribute', function () {
        const expected = '2002-08-15T08:46:00-07:00'
        const actual = instance.timestamp

        expect(actual).to.equal(expected)
      })
    })

    describe('url', function () {
      it('must match the value of the specified "URL" element', function () {
        const expected = 'http://xml.workchairs.com/retrieve?reqUrl=20626;Initial=TRUE'
        const actual = instance.url

        expect(actual).to.equal(expected)
      })
    })
  })
})

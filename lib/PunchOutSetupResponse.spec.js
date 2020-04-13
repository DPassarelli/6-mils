/* eslint-env mocha */

const fs = require('fs')
const path = require('path')

const testsForAllCxmlMessages = require(path.join(__dirname, '../test/shared-unit/cxml.js'))
const testsForInboundMessages = require(path.join(__dirname, '../test/shared-unit/inbound.js'))
const testsForResponseMessages = require(path.join(__dirname, '../test/shared-unit/response.js'))

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

  describe('the common elements for all cXML messages', function () {
    testsForAllCxmlMessages(T)
  })

  describe('the common elements for all inbound messages', function () {
    testsForInboundMessages(T)
  })

  describe('the common elements for all response messages', function () {
    testsForResponseMessages(T)
  })

  describe('the instance members specific for this class', function () {
    describe('url', function () {
      context('for a successful response', function () {
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

        it('must match the value of the "URL" element', function () {
          const expected = 'http://xml.workchairs.com/retrieve?reqUrl=20626;Initial=TRUE'
          const actual = instance.url

          expect(actual).to.equal(expected)
        })
      })
    })

    context('for a non-successful response', function () {
      /**
       * To reduce boilerplate code, a shared instance is used for each test,
       * which gets reset before each one.
       * @type {Object}
       */
      let instance = null

      let sourceXml = null

      before(function (done) {
        fs.readFile(path.join(__dirname, '../test/samples/PunchOutSetupResponse-400.xml'), function (err, contents) {
          if (err) {
            done(err)
            return
          }

          sourceXml = contents.toString()
          instance = new T(sourceXml)
          done()
        })
      })

      it('must be empty', function () {
        const expected = ''
        const actual = instance.url

        expect(actual).to.equal(expected)
      })
    })
  })
})

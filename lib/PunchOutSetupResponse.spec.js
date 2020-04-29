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

const SAMPLE_CXML = fs.readFileSync(path.join(__dirname, '../test/samples/PunchOutSetupResponse.xml')).toString()
const FAILED_CXML = fs.readFileSync(path.join(__dirname, '../test/samples/PunchOutSetupResponse-400.xml')).toString()

function getNewInstance (src) {
  switch (src) {
    case 'undefined':
      return new T()

    case 'empty-string':
      return new T('')

    default:
      return new T(src || SAMPLE_CXML)
  }
}

describe('the "PunchOutSetupResponse" module', function () {
  describe('the common elements for all cXML messages', function () {
    testsForAllCxmlMessages(getNewInstance)
  })

  describe('the common elements for all inbound messages', function () {
    testsForInboundMessages(getNewInstance)
  })

  describe('the common elements for all response messages', function () {
    testsForResponseMessages(getNewInstance)
  })

  describe('the instance members specific for this class', function () {
    describe('the "url" property', function () {
      context('for a successful response', function () {
        const instance = getNewInstance()

        it('must match the value of the "URL" element', function () {
          const expected = 'http://xml.workchairs.com/retrieve?reqUrl=20626;Initial=TRUE'
          const actual = instance.url

          expect(actual).to.equal(expected)
        })
      })

      context('for a non-successful response', function () {
        const instance = getNewInstance(FAILED_CXML)

        it('must be undefined', function () {
          expect(instance.url).to.be.undefined // eslint-disable-line
        })
      })
    })
  })
})

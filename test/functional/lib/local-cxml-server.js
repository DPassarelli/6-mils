const debug = require('debug')('6-mils:local-server')
const fs = require('fs')
const http = require('http')
const path = require('path')

const EventEmitter = require('events')

/**
 * The singleton instance.
 * @type {Object}
 */
let server = null

/**
 * The contents of a successful PunchOut Setup Response (POSRes).
 * @type {String}
 */
const POSR_SUCCESS_CONTENT = fs.readFileSync(path.join(__dirname, '../../samples/PunchOutSetupResponse.xml')).toString()

/**
 * The contents of a failed (non-successful) POSRes.
 * @type {String}
 */
const POSR_FAILURE_CONTENT = fs.readFileSync(path.join(__dirname, '../../samples/PunchOutSetupResponse-400.xml')).toString()

/**
 * The contents of a successful Order Response (ORes).
 * @type {String}
 */
const ORES_SUCCESS_CONTENT = fs.readFileSync(path.join(__dirname, '../../samples/OrderResponse.xml')).toString()

/**
 * The contents of a failed (non-successful) ORes.
 * @type {String}
 */
const ORES_FAILURE_CONTENT = fs.readFileSync(path.join(__dirname, '../../samples/OrderResponse-400.xml')).toString()

class CxmlServer extends EventEmitter {
  constructor () {
    super()

    const self = this

    self.listener = http.createServer((req, res) => {
      const requestBody = []

      req.on('data', (chunk) => { requestBody.push(chunk.toString()) })

      req.on('end', () => {
        self.emit('request', requestBody.join(''))

        switch (req.url) {
          case '/posr/success':
            debug('replying with successful PunchOut Setup Response')
            res.setHeader('content-type', 'application/xml')
            res.end(POSR_SUCCESS_CONTENT)
            break

          case '/posr/failure':
            debug('replying with failed PunchOut Setup Response')
            res.setHeader('content-type', 'application/xml')
            res.end(POSR_FAILURE_CONTENT)
            break

          case '/order/success':
            debug('replying with successful Order Response')
            res.setHeader('content-type', 'application/xml')
            res.end(ORES_SUCCESS_CONTENT)
            break

          case '/order/empty':
            debug('replying with empty Order Response')
            res.statusCode = 200
            res.end()
            break

          case '/order/failure':
            debug('replying with failed Order Response')
            res.setHeader('content-type', 'application/xml')
            res.end(ORES_FAILURE_CONTENT)
            break

          default:
            res.statusCode = parseInt(/\d+/.exec(req.url)[0], 10)
            debug('replying with code %d', res.statusCode)
            res.end()
        }
      })
    })

    self.listener.on('close', function () {
      debug('LOCAL TEST SERVER STOPPED')
      self.emit('closed')
    })

    self.listener.listen(0, '127.0.0.1', () => {
      debug('LOCAL TEST SERVER LISTENING ON %s', self.baseUrl)
      self.emit('ready')
    })
  }

  close () {
    this.listener.close()
  }

  get baseUrl () {
    const address = this.listener.address()
    return `http://${address.address}:${address.port}`
  }
}

module.exports = function () {
  if (server == null) server = new CxmlServer()
  return server
}

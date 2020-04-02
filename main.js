const PunchOutSetupRequest = require('./lib/PunchOutSetupRequest.js')
const PunchOutOrderMessage = require('./lib/PunchOutOrderMessage.js')

module.exports = Object.seal({
  PunchOutSetupRequest: PunchOutSetupRequest,
  PunchOutOrderMessage: PunchOutOrderMessage
})

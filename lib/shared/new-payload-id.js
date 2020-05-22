const process = require('process')
const uid = require('ulid').ulid

/**
 * Returns a new random payload identifier. This value is constructed according
 * to the suggested implementation in the cXML Reference Guide.
 *
 * @param  {String}   hostname   A value to use at the end of the identifier.
 *                               This should be blank, or a value beginning with
 *                               the `@` symbol.
 *
 * @return {String}
 */
module.exports = function (hostname) {
  hostname = hostname || '@6-mils'

  const time = Date.now()
  const processId = process.ppid
  const uniqueId = uid().substring(16)

  return `${time}.${processId}.${uniqueId}${hostname}`
}

module.exports = function (src, attrName) {
  const searchFor = new RegExp(`${attrName}="[^"]*"`)
  const matches = searchFor.exec(src)

  if (matches == null) {
    throw new Error(`The attribute "${attrName}" cannot be found in the specified source.`)
  }

  return matches[0].replace(/"/g, '').substring(attrName.length + 1)
}

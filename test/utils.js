const web3 = require('web3')

module.exports = {
  hexToAscii: x => web3.utils.hexToAscii(x).replace(/\u0000/g, ''),
  asciiToHex: x => web3.utils.asciiToHex(x),
  BN: x => new web3.utils.BN(x)
}

const web3 = require('web3')

const testConfig = {
  name: 'MESG Test',
  symbol: 'MESG Test',
  decimals: 18,
  totalSupply: 100000000
}

const newDefaultToken = async (MESGToken, owner) => {
  const contract = await MESGToken.new(testConfig.name, testConfig.symbol, testConfig.decimals, testConfig.totalSupply, { from: owner })
  console.log('new contract deployed at', contract.address)
  return contract
}

const BN = x => new web3.utils.BN(x)

module.exports = {
  testConfig,
  newDefaultToken,
  BN,
  hexToAscii: x => web3.utils.hexToAscii(x).replace(/\u0000/g, ''),
  asciiToHex: x => web3.utils.asciiToHex(x),
  mulDecimals: (t, d) => BN(t).mul(BN(10).pow(BN(d))),
  percent: (n, p) => BN(n).mul(BN(p * 1000)).div(BN(100 * 1000))
}

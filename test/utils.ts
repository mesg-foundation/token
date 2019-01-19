import BigNumber from "bignumber.js";
import { MESGTokenContract } from "../types/truffle-contracts";

const testConfig = {
  name: 'MESG Test',
  symbol: 'MESG Test',
  decimals: 18,
  totalSupply: 100000000
}

const newDefaultToken = async (MESGToken: MESGTokenContract, owner: string) => {
  const contract = await MESGToken.new(testConfig.name, testConfig.symbol, testConfig.decimals, testConfig.totalSupply, { from: owner })
  console.log('new contract deployed at', contract.address)
  return contract
}

const BN = (x: any) => new BigNumber(x)

module.exports = {
  testConfig,
  newDefaultToken,
  BN,
  // hexToAscii: x => web3.utils.hexToAscii(x).replace(/\u0000/g, ''),
  // asciiToHex: x => web3.utils.asciiToHex(x),
  mulDecimals: (t: any, d: any) => BN(t).times(BN(10).pow(d)),
  percent: (n: any, p: any) => BN(n).times(p).div(100)
}

/* global artifacts */

const MESGToken = artifacts.require('MESGToken')
const config = require('./config.js')
const { mulDecimals, percent } = require('../test/utils')

const calculatedTotalSupply = mulDecimals(config.totalSupply, config.decimals)

module.exports = async (deployer, network, accounts) => {
  const [
    nicolasCreator,
    nicolasFund, // Team and Founders 12.5%
    mesgSale, // Sale Distribution 62.5%
    mesgReserve, // Reserve 20% + pauser role
    mesgPartnersBounties // Partners & Bounties 5%
  ] = accounts
  console.log('nicolasCreator', nicolasCreator)
  console.log('nicolasFund', nicolasFund)
  console.log('mesgSale', mesgSale)
  console.log('mesgReserve', mesgReserve)
  console.log('mesgPartnersBounties', mesgPartnersBounties)

  await deployer.deploy(MESGToken, config.name, config.symbol, config.decimals, config.totalSupply, { from: nicolasCreator })

  const contract = await MESGToken.deployed()
  console.log('contract deployed at', contract.address)

  console.log('transfer to nicolasFund...')
  await contract.transfer(nicolasFund, percent(calculatedTotalSupply, config.balances['nicolasFund']), { from: nicolasCreator })

  console.log('transfer to mesgSale...')
  await contract.transfer(mesgSale, percent(calculatedTotalSupply, config.balances['mesgSale']), { from: nicolasCreator })

  console.log('transfer to mesgReserve...')
  await contract.transfer(mesgReserve, percent(calculatedTotalSupply, config.balances['mesgReserve']), { from: nicolasCreator })

  console.log('transfer to mesgPartnersBounties...')
  await contract.transfer(mesgPartnersBounties, percent(calculatedTotalSupply, config.balances['mesgPartnersBounties']), { from: nicolasCreator })

  console.log('add mesgReserve as pauser')
  await contract.addPauser(mesgReserve, { from: nicolasCreator })

  console.log('remove nicolasCreator as pauser')
  await contract.renouncePauser({ from: nicolasCreator })
}

/* global artifacts */

const MESGToken = artifacts.require('MESGToken')
const config = require('./config.js')
const { mulDecimals, percent } = require('../test/utils')

const calculatedTotalSupply = mulDecimals(config.totalSupply, config.decimals)

const {
  MESG_TOKEN_NICOLAS_FUND: nicolasFund, // Team and Founders 12.5%
  MESG_TOKEN_MESG_SALE: mesgSale, // Sale Distribution 62.5%
  MESG_TOKEN_MESG_RESERVE: mesgReserve, // Reserve 20% + pauser role
  MESG_TOKEN_MESG_PARTNERS_BOUNTIES: mesgPartnersBounties // Partners & Bounties 5%
} = process.env

module.exports = async (deployer) => {
  console.log('nicolasFund\t\t', nicolasFund)
  console.log('mesgSale\t\t', mesgSale)
  console.log('mesgReserve\t\t', mesgReserve)
  console.log('mesgPartnersBounties\t', mesgPartnersBounties)

  await deployer.deploy(MESGToken, config.name, config.symbol, config.decimals, config.totalSupply)

  const contract = await MESGToken.deployed()
  console.log('contract deployed at', contract.address)

  console.log('transfer to nicolasFund...')
  await contract.transfer(nicolasFund, percent(calculatedTotalSupply, config.balances['nicolasFund']))

  console.log('transfer to mesgSale...')
  await contract.transfer(mesgSale, percent(calculatedTotalSupply, config.balances['mesgSale']))

  console.log('transfer to mesgReserve...')
  await contract.transfer(mesgReserve, percent(calculatedTotalSupply, config.balances['mesgReserve']))

  console.log('transfer to mesgPartnersBounties...')
  await contract.transfer(mesgPartnersBounties, percent(calculatedTotalSupply, config.balances['mesgPartnersBounties']))

  console.log('add mesgReserve as pauser')
  await contract.addPauser(mesgReserve)

  console.log('remove nicolasCreator as pauser')
  await contract.renouncePauser()
}

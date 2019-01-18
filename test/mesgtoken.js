/* eslint-env mocha */
/* global contract, artifacts */

const assert = require('chai').assert
const { BN, mulDecimals, percent } = require('./utils')
const MESGToken = artifacts.require('MESGToken')
const config = require('../migrations/config.js')

const calculatedTotalSupply = mulDecimals(config.totalSupply, config.decimals)

contract('MESG Token', async (accounts) => {
  const [
    nicolasCreator,
    nicolasFund, // Team and Founders 12.5%
    mesgSale, // Sale Distribution 62.5%
    mesgReserve, // Reserve 20% + pauser role
    mesgPartnersBounties, // Partners & Bounties 5%
    other
  ] = accounts
  let contract = null

  before(async () => {
    contract = await MESGToken.deployed()
    console.log('deployed address', contract.address)
  })

  describe('metadata', async () => {
    it('should have the right supply', async () => {
      assert.isTrue((await contract.totalSupply()).eq(calculatedTotalSupply))
    })

    it('should have the right name', async () => {
      assert.equal(await contract.name(), config.name)
    })

    it('should have the right symbol', async () => {
      assert.equal(await contract.symbol(), config.symbol)
    })

    it('should have the right decimals', async () => {
      assert.equal(await contract.decimals(), config.decimals)
    })
  })

  describe('balances', async () => {
    let totalBalances = BN(0)
    it('nicolasCreator should have 0', async () => {
      const balance = await contract.balanceOf(nicolasCreator)
      assert.isTrue(balance.eq(BN(0)))
    })

    it('nicolasFund should have 12.5%', async () => {
      const balance = await contract.balanceOf(nicolasFund)
      const configPercent = config.balances['nicolasFund']
      assert.isTrue(balance.eq(percent(calculatedTotalSupply, configPercent)))
      assert.equal(balance.mul(BN(1000)).div(calculatedTotalSupply).toNumber() / 10, configPercent)
      totalBalances = totalBalances.add(balance)
    })

    it('mesgSale should have 62.5%', async () => {
      const balance = await contract.balanceOf(mesgSale)
      const configPercent = config.balances['mesgSale']
      assert.isTrue(balance.eq(percent(calculatedTotalSupply, configPercent)))
      assert.equal(balance.mul(BN(1000)).div(calculatedTotalSupply).toNumber() / 10, configPercent)
      totalBalances = totalBalances.add(balance)
    })

    it('mesgReserve should have 20%', async () => {
      const balance = await contract.balanceOf(mesgReserve)
      const configPercent = config.balances['mesgReserve']
      assert.isTrue(balance.eq(percent(calculatedTotalSupply, configPercent)))
      assert.equal(balance.mul(BN(1000)).div(calculatedTotalSupply).toNumber() / 10, configPercent)
      totalBalances = totalBalances.add(balance)
    })

    it('mesgPartnersBounties should have 5%', async () => {
      const balance = await contract.balanceOf(mesgPartnersBounties)
      const configPercent = config.balances['mesgPartnersBounties']
      assert.isTrue(balance.eq(percent(calculatedTotalSupply, configPercent)))
      assert.equal(balance.mul(BN(1000)).div(calculatedTotalSupply).toNumber() / 10, configPercent)
      totalBalances = totalBalances.add(balance)
    })

    it('total balance should be equal to total supply', async () => {
      assert.isTrue(calculatedTotalSupply.eq(totalBalances))
    })

    it('other should have 0', async () => {
      assert.isTrue((await contract.balanceOf(other)).eq(BN(0)))
    })
  })

  describe('pauser roles', async () => {
    it('mesgReserve should be pauser', async () => {
      assert.isTrue(await contract.isPauser(mesgReserve))
    })

    it('nicolasCreator should not be pauser', async () => {
      assert.isFalse(await contract.isPauser(nicolasCreator))
    })

    it('nicolasFund should not be pauser', async () => {
      assert.isFalse(await contract.isPauser(nicolasFund))
    })

    it('mesgSale should not be pauser', async () => {
      assert.isFalse(await contract.isPauser(mesgSale))
    })

    it('mesgPartnersBounties should not be pauser', async () => {
      assert.isFalse(await contract.isPauser(mesgPartnersBounties))
    })

    it('other should not be pauser', async () => {
      assert.isFalse(await contract.isPauser(other))
    })
  })
})

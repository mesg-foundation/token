/* eslint-env mocha */
/* global contract, artifacts */

const assert = require('chai').assert
const truffleAssert = require('truffle-assertions')
const utils = require('./utils')
const MESGToken = artifacts.require('MESGToken')

const name = 'MESG Token'
const symbol = 'MESG'
const decimals = 18
const totalSupply = 250000000
const calculatedTotalSupply = utils.BN(totalSupply).mul(utils.BN(10).pow(utils.BN(decimals)))
const newDefaultToken = (owner) => MESGToken.new(name, symbol, decimals, totalSupply, { from: owner })

module.exports = { name, symbol, decimals, totalSupply, newDefaultToken }

const assertEventTransferEvent = (tx, from, to, value) => {
  truffleAssert.eventEmitted(tx, 'Transfer')
  const event = tx.logs[0].args
  assert.equal(event.from, from)
  assert.equal(event.to, to)
  assert.isTrue(event.value.eq(utils.BN(value)))
}

contract('MESG Token', async ([ contractOwner, userA, userB, other ]) => {
  let contract = null

  before(async () => {
    contract = await newDefaultToken(contractOwner)
  })

  it('should have the right supply', async () => {
    assert.isTrue((await contract.totalSupply()).eq(calculatedTotalSupply))
  })

  it('should have the right name', async () => {
    assert.equal(await contract.name(), name)
  })

  it('should have the right symbol', async () => {
    assert.equal(await contract.symbol(), symbol)
  })

  it('should have the right decimals', async () => {
    assert.equal(await contract.decimals(), decimals)
  })

  it('creator should have all the supply', async () => {
    const balanceOf = await contract.balanceOf(contractOwner)
    assert.isTrue(balanceOf.eq(calculatedTotalSupply))
  })

  it('other should have 0 token', async () => {
    const balanceOf = await contract.balanceOf(other)
    assert.isTrue(balanceOf.eq(utils.BN(0)))
  })

  it('creator should transfer 100 token to userA', async () => {
    const tx = await contract.transfer(userA, 100, { from: contractOwner })
    assertEventTransferEvent(tx, contractOwner, userA, 100)
  })

  it('creator should have 100 token less', async () => {
    const balanceOf = await contract.balanceOf(contractOwner)
    assert.isTrue(balanceOf.eq(calculatedTotalSupply.sub(utils.BN(100))))
  })

  it('userA should have 100 token', async () => {
    const balanceOf = await contract.balanceOf(userA)
    assert.isTrue(balanceOf.eq(utils.BN(100)))
  })

  it('userA should transfer 100 token to userB', async () => {
    const tx = await contract.transfer(userB, 100, { from: userA })
    assertEventTransferEvent(tx, userA, userB, 100)
  })

  it('userA should have 0 token', async () => {
    const balanceOf = await contract.balanceOf(userA)
    assert.isTrue(balanceOf.eq(utils.BN(0)))
  })

  it('userB should have 100 token', async () => {
    const balanceOf = await contract.balanceOf(userB)
    assert.isTrue(balanceOf.eq(utils.BN(100)))
  })
})

import { MESGTokenInstance } from "../types/truffle-contracts";

/* eslint-env mocha */
/* global contract, artifacts */

const assert = require('chai').assert
const truffleAssert = require('truffle-assertions')
const { testConfig, newDefaultToken, BN, mulDecimals } = require('./utils')
const MESGToken = artifacts.require('MESGToken')

const calculatedTotalSupply = mulDecimals(testConfig.totalSupply, testConfig.decimals)

const assertEventTransferEvent = (tx: Truffle.TransactionResponse, from: string, to: string, value: any) => {
  truffleAssert.eventEmitted(tx, 'Transfer')
  const event = tx.logs[0].args
  assert.equal(event.from, from)
  assert.equal(event.to, to)
  assert.isTrue(event.value.eq(BN(value)))
}

contract('Token', async ([ contractOwner, userA, userB, other ]) => {
  let contract: MESGTokenInstance

  before(async () => {
    contract = await newDefaultToken(MESGToken, contractOwner)
  })

  it('should have the right supply', async () => {
    assert.isTrue((await contract.totalSupply()).eq(calculatedTotalSupply))
  })

  it('should have the right name', async () => {
    assert.equal(await contract.name(), testConfig.name)
  })

  it('should have the right symbol', async () => {
    assert.equal(await contract.symbol(), testConfig.symbol)
  })

  it('should have the right decimals', async () => {
    assert.equal(await contract.decimals(), testConfig.decimals)
  })

  it('creator should have all the supply', async () => {
    const balanceOf = await contract.balanceOf(contractOwner)
    assert.isTrue(balanceOf.eq(calculatedTotalSupply))
  })

  it('other should have 0 token', async () => {
    const balanceOf = await contract.balanceOf(other)
    assert.isTrue(balanceOf.eq(BN(0)))
  })

  it('creator should transfer 100 token to userA', async () => {
    const tx = await contract.transfer(userA, 100, { from: contractOwner })
    assertEventTransferEvent(tx, contractOwner, userA, 100)
  })

  it('creator should have 100 token less', async () => {
    const balanceOf = await contract.balanceOf(contractOwner)
    assert.isTrue(balanceOf.eq(calculatedTotalSupply.sub(BN(100))))
  })

  it('userA should have 100 token', async () => {
    const balanceOf = await contract.balanceOf(userA)
    assert.isTrue(balanceOf.eq(BN(100)))
  })

  it('userA should transfer 100 token to userB', async () => {
    const tx = await contract.transfer(userB, 100, { from: userA })
    assertEventTransferEvent(tx, userA, userB, 100)
  })

  it('userA should have 0 token', async () => {
    const balanceOf = await contract.balanceOf(userA)
    assert.isTrue(balanceOf.eq(BN(0)))
  })

  it('userB should have 100 token', async () => {
    const balanceOf = await contract.balanceOf(userB)
    assert.isTrue(balanceOf.eq(BN(100)))
  })
})

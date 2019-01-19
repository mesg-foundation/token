import { MESGTokenInstance } from "../types/truffle-contracts";

/* eslint-env mocha */
/* global contract, artifacts */

const assert = require('chai').assert
const truffleAssert = require('truffle-assertions')
const MESGToken = artifacts.require('MESGToken')
const { newDefaultToken } = require('./utils')

contract('MESG Token Pausable', async accounts => {
  const [
    originalOwner,
    newOwner,
    other
  ] = accounts

  let contract: MESGTokenInstance

  describe('Pauser role', async () => {
    before(async () => {
      contract = await newDefaultToken(MESGToken, originalOwner)
    })

    it('original owner should be pauser', async () => {
      assert.isTrue(await contract.isPauser(originalOwner))
    })

    it('other should not be pauser', async () => {
      assert.isFalse(await contract.isPauser(other))
    })

    it('should add pauser role', async () => {
      const tx = await contract.addPauser(newOwner, { from: originalOwner })
      truffleAssert.eventEmitted(tx, 'PauserAdded')
    })

    it('should remove pauser role', async () => {
      const tx = await contract.renouncePauser({ from: originalOwner })
      truffleAssert.eventEmitted(tx, 'PauserRemoved')
    })

    it('previous owner should not be pauser', async () => {
      assert.isFalse(await contract.isPauser(originalOwner))
    })

    it('new owner should be pauser', async () => {
      assert.isTrue(await contract.isPauser(newOwner))
    })
  })

  describe('Pause contract', async () => {
    before(async () => {
      contract = await newDefaultToken(MESGToken, originalOwner)
    })

    it('should pause', async () => {
      assert.equal(await contract.paused(), false)
      const tx = await contract.pause({ from: originalOwner })
      truffleAssert.eventEmitted(tx, 'Paused')
      assert.equal(await contract.paused(), true)
    })

    it('should unpause', async () => {
      assert.equal(await contract.paused(), true)
      const tx = await contract.unpause({ from: originalOwner })
      truffleAssert.eventEmitted(tx, 'Unpaused')
      assert.equal(await contract.paused(), false)
    })

    describe('Test modifier whenNotPaused', async () => {
      before(async () => {
        await contract.pause({ from: originalOwner })
      })

      it('should not be able to transfer', async () => {
        await truffleAssert.reverts(contract.transfer(other, 1, { from: originalOwner }))
      })

      it('should not be able to transferFrom', async () => {
        await truffleAssert.reverts(contract.transferFrom(other, newOwner, 1, { from: originalOwner }))
      })

      it('should not be able to approve', async () => {
        await truffleAssert.reverts(contract.approve(other, 1, { from: originalOwner }))
      })

      it('should not be able to increaseAllowance', async () => {
        await truffleAssert.reverts(contract.increaseAllowance(other, 1, { from: originalOwner }))
      })

      it('should not be able to decreaseAllowance', async () => {
        await truffleAssert.reverts(contract.decreaseAllowance(other, 1, { from: originalOwner }))
      })
    })
  })
})

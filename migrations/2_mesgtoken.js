/* global artifacts */

const MESGToken = artifacts.require('./MESGToken.sol')

module.exports = async (deployer) => {
  await deployer.deploy(MESGToken, 'MESG Token', 'MESG', 18, 250000000)
}

pragma solidity >=0.5.0 <0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract MESGToken is ERC20, ERC20Detailed, ERC20Pausable {
  constructor(
    string memory name,
    string memory symbol,
    uint8 decimals,
    uint256 totalSupply
  )
    ERC20Detailed(name, symbol, decimals)
    ERC20Pausable()
    ERC20()
    public
  {
    require(totalSupply > 0, "totalSupply has to be greater than 0");
    _mint(msg.sender, totalSupply.mul(10 ** uint256(decimals)));
  }
}

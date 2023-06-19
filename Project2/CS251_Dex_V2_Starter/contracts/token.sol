// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Your token contract
contract Token is Ownable, ERC20 {
    string private constant _symbol = "DHN";
    string private constant _name = "Duhana Token";
    bool private _mintingEnabled = true;

    event MintingDisabled();

    constructor() ERC20(_name, _symbol) {}

    // Function _mint: Create more of your tokens.
    // You can change the inputs, or the scope of your function, as needed.
    // Do not remove the AdminOnly modifier!
    function mint(uint256 amount) public onlyOwner {
        require(_mintingEnabled, "Minting is disabled");
        _mint(msg.sender, amount);
    }

    // Function _disable_mint: Disable future minting of your token.
    // You can change the inputs, or the scope of your function, as needed.
    // Do not remove the AdminOnly modifier!
    function disable_mint() public onlyOwner {
        _mintingEnabled = false;
        emit MintingDisabled();
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

 
// Your token contract
contract Token is Ownable, ERC20 {
    string private constant _symbol = 'RC';                 // TODO: Give your token a symbol (all caps!)
    string private constant _name = 'Racoin';                   // TODO: Give your token a name

    bool private can_mint = true;

    constructor() ERC20(_name, _symbol) {}

    // ============================================================
    //                    FUNCTIONS TO IMPLEMENT
    // ============================================================

    // Function _mint: Create more of your tokens.
    // You can change the inputs, or the scope of your function, as needed.
    // Do not remove the AdminOnly modifier!
    function mint(address account, uint256 amount) 
        public 
        onlyOwner
    {
        require(can_mint, "ERC20: You cant mint");
        _mint(account, amount);
    }

    // Function _disable_mint: Disable future minting of your token.
    // You can change the inputs, or the scope of your function, as needed.
    // Do not remove the AdminOnly modifier!
    function disable_mint(bool can)
        public
        onlyOwner
    {
        can_mint = can;
    }
}
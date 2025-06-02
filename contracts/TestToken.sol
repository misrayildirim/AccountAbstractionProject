// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // OpenZeppelin ERC20 standardı
contract TestToken is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        // Oluşturucu, tokenın adını, sembolünü ve başlangıç arzını alır
        _mint(msg.sender, initialSupply);
    }

    // Gerekirse ek mint fonksiyonları eklenebilir, ancak şimdilik başlangıç mint yeterli.
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
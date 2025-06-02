// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@account-abstraction/contracts/interfaces/IPaymaster.sol"; 
import "@account-abstraction/contracts/core/EntryPoint.sol"; 
import { PackedUserOperation } from "@account-abstraction/contracts/interfaces/PackedUserOperation.sol"; 

contract Paymaster is IPaymaster { 
    EntryPoint public immutable entryPoint; // EntryPoint sözleşmesi 
    address public owner; 

    constructor(address _entryPoint) { 
        entryPoint = EntryPoint(payable(_entryPoint)); 
        owner = msg.sender; // Deploy eden kişi owner olur
    }

    modifier onlyEntryPoint() {
        require(msg.sender == address(entryPoint), "Not from EntryPoint");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    
    function validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash, 
        uint256 maxCost
    ) external override returns (bytes memory context, uint256 validationData) {
    
        require(address(this).balance >= maxCost, "Paymaster: Insufficient balance to cover gas");
        require(userOp.sender != address(0), "Invalid sender"); 
        return (abi.encodePacked(address(this)), 0); 
    }

    
    function postOp(
        IPaymaster.PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost,
        uint256 actualUserOpFeePerGas
    ) external override onlyEntryPoint {

        (mode, context, actualGasCost, actualUserOpFeePerGas);
    }

    // ETH alımına onay vermek için
    receive() external payable {}

    // Sahibi tarafından ETH çekmek için
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        to.transfer(amount);
    }
}
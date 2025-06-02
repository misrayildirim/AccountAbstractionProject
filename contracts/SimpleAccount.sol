// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { BaseAccount } from "@account-abstraction/contracts/core/BaseAccount.sol";
import "@account-abstraction/contracts/interfaces/PackedUserOperation.sol";
import { IEntryPoint } from "@account-abstraction/contracts/interfaces/IEntryPoint.sol";

contract SimpleAccount is BaseAccount {
    address public owner;
    IEntryPoint private immutable _entryPoint;

    constructor(IEntryPoint entryPointAddress) {
        owner = msg.sender;
        _entryPoint = entryPointAddress;
    }

    function entryPoint() public view override returns (IEntryPoint) {
        return _entryPoint;
    }
      // Kullanıcı işlemini doğrular
    function validateUserOp(
        PackedUserOperation calldata userOp,
        bytes32,
        uint256
    ) external view override returns (uint256) {
        require(msg.sender == address(entryPoint()), "Only EntryPoint");
        require(userOp.sender == address(this), "Invalid sender");
        return 0;
    }

    function execute( //adrese fonksiyon çağrısı yapar
        address dest,
        uint256 value,
        bytes calldata func
    ) external override {
        require(msg.sender == address(entryPoint()), "Only EntryPoint");
        (bool success, ) = dest.call{value: value}(func);
        require(success, "Execution failed");
    }

    function _validateSignature( //imza doğrulaması yapar
        PackedUserOperation calldata,
        bytes32
    ) internal view override returns (uint256) {
        return 0;
    }

    receive() external payable {}
    fallback() external payable {}
}




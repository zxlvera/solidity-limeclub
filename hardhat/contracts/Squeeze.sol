//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

// Function on webpage
// 1. Send a squeeze()
// 2. View getTotalSqueezes() - uint256

contract SqueezePortal {
    uint256 totalSqueezes;
    uint256 private seed;
    
    event NewSqueeze(address indexed from, uint256 timestamp, string message);
    
    struct Squeeze {
        address squeezer;
        string message;
        uint256 timestamp;
    }
    
    Squeeze[] squeezes;
    mapping(address => uint256) public lastSqueezedAt;
    
    constructor() payable {
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function squeeze(string memory _message) public {
        require(
            lastSqueezedAt[msg.sender] + 5 minutes < block.timestamp,
            "Wait 5m"
        );
        lastSqueezedAt[msg.sender] = block.timestamp;
        totalSqueezes += 1;
        squeezes.push(Squeeze(msg.sender, _message, block.timestamp));
        /* Generate new seed for next user that sends a wave */
        seed = (block.timestamp + block.difficulty + seed) % 100;

        if (seed <= 50) {
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}(""); 
            require(success, "Failed to withdraw money from contract");
        }
        emit NewSqueeze(msg.sender, block.timestamp, _message);
    }

    function getAllSqueezes() public view returns(Squeeze[] memory) {
        return squeezes;
    }

    function getTotalSqueezes() public view returns(uint256) {
        return totalSqueezes;
    }
}

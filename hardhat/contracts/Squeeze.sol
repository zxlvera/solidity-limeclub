//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

// Function on webpage
// 1. Send a squeeze()
// 2. View getTotalSqueezes() - uint256

contract Squeeze {
    uint256 totalSqueezes;
    
    event NewSqueeze(address indexed from, uint256 timestamp, string message);
    
    struct Squeeze {
        address squeezer;
        string message;
        uint256 timestamp;
    }
    
    Squeeze[] squeezes;
    
    constructor() {
    }

    function squeeze(string memory _message) public {
        totalSqueezes += 1;
        squeezes.push(Squeeze(msg.sender, _message, block.timestamp));
        emit NewSqueeze(msg.sender, block.timestamp, _message);
    }

    function getAllSqueezes() public view returns(Squeeze[] memory) {
        return squeezes;
    }

    function getTotalSqueezes() public view returns(uint256) {
        return totalSqueezes;
    }
}

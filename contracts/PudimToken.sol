pragma solidity ^0.5.16;

contract PudimToken {

    string public name =  "Pudim Token";

    uint256 public totalSupply;

    mapping(address => uint) public balanceOf;

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;


    }
}
pragma solidity ^0.5.16;

contract PudimToken {
    //Constructor
    //Numero total de Tokens
    //Ler o numero total de tokens
    uint256 public totalSupply;

    constructor() public {
        totalSupply = 1000000;
    }
}
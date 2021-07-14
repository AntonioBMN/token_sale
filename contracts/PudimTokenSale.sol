pragma solidity  >=0.5.16 <0.9.0;

import "./PudimToken.sol";

contract PudimTokenSale{
    address admin;
    PudimToken public tokenContract;
    uint public tokenPrice;
    uint public tokenSold;

    event Sell(address _buyer, uint _amount);

    constructor(PudimToken _tokenContract,uint _tokenPrice) public{
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint x, uint y) internal pure returns (uint z){
        require(y==0 || (z = x * y) / y == x);
    }

    function buyTokens(uint _numberOfTokens) public payable{

        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        tokenSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }

    //Finalizar a venda de tokens 
    function endSale() public{
        //Require admin
        require(msg.sender == admin);
        //Transferir os tokens restantes pro adm
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        //destruir Token
        selfdestruct(address(uint160(admin)));
    }
}
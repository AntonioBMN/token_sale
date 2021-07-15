pragma solidity  >=0.5.16 <0.9.0;

import "./PudimToken.sol";

contract PudimTokenSale{
    // Instancia o contrato admin
    address admin;
    // Instancia uma variavel do tipo PudimToken pra se referir ao tokenContract a partir do PudimTokenSale.
    PudimToken public tokenContract;
    // Instancia uma variavel do tipo uint pra se referir ao valor do token.
    uint public tokenPrice;
    // Instancia uma variavel do tipo uint pra se referir a quantidade de tokens vendidos.
    uint public tokenSold;

    // Cria o evento q constata a venda;
    event Sell(address _buyer, uint _amount);
    
    // Construtor da loja de tokens
    constructor(PudimToken _tokenContract,uint _tokenPrice) public{
        // Atribui a tag admin ao endereço de quem chamou o contrato 
        admin = msg.sender;
        // Atribui o endereço do token a variavel tokenContract
        tokenContract = _tokenContract;
        // atribui o preço do token a variavel tokenPrice (em wei)
        tokenPrice = _tokenPrice;
    }
    // Função para multiplicar dois interios de forma que não ocorra falhas
    function multiply(uint x, uint y) internal pure returns (uint z){
        require(y==0 || (z = x * y) / y == x);
    }

    // Função que compra os tokens disponiveis no SC da loja
    function buyTokens(uint _numberOfTokens) public payable{
        // Requer que o valor enviado em wei seja igual ao custo total de transação em wei
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        // Requer que a loja tenha fundos suficientes pra vender/
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        // Transfere o que foi vendido
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        // incrementa a quantidade de tokens vendidos
        tokenSold += _numberOfTokens;
        // Emite o evento de venda;
        emit Sell(msg.sender, _numberOfTokens);
    }

    //Finalizar a venda de tokens;
    function endSale() public{
        //Requer que quem chame essa função seja unicamente o admin;
        require(msg.sender == admin);
        //Transferir os tokens restantes, que nao foram vendidos, pro adm;
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        //destruir contrato e encerra de fato a venda;
        selfdestruct(address(uint160(admin)));
    }
}
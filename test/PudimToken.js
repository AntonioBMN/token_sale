var PudimToken = artifacts.require("./PudimToken.sol");

contract('PudimToken', function(accounts){
    it('Inicializa o contrato com os valores corretos', function(){
        return PudimToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name, 'Pudim Token', 'Tem o nome correto');
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol, 'PDT', 'Tem o token correto');
        });
    });
    it('Aloca o supplyInicial',function(){
        return PudimToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 1000000,'TotalSupply correto igual a 1000000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 1000000, "Aloca o initial supply para conta adm");
        })
    })
})
var PudimToken = artifacts.require("./PudimToken.sol");

contract('PudimToken', function(accounts){
    it('Verifica se o totalSupply está correto',function(){
        return PudimToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 1000000,'TotalSupply correto igual a 1000000');
        })
    })
})
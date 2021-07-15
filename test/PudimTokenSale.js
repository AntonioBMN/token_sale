var PudimTokenSale = artifacts.require("./PudimTokenSale.sol");
var PudimToken = artifacts.require("./PudimToken.sol");

contract('PudimTokenSale',function(accounts){
    var tokenInstance;
    var tokenSaleInstance;
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokenPrice = 10000000000000;
    var tokensAvailable = 750000;
    var numberOfTokens;

    it('Inicia o contrato com os valores corretos',function(){
        return PudimTokenSale.deployed().then(function(instance){
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then(function(address){
            assert.notEqual(address,0x0,'Tem um endereço');
            return tokenSaleInstance.tokenContract();
        }).then(function(address){
            assert.notEqual(address,0x0,'Tem um endereço');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
            assert.equal(price, tokenPrice, 'Preço correto');
        })
    })

    it('Inicia a função de compra',function(){
        return PudimToken.deployed().then(function(instance){
            tokenInstance = instance;
            return PudimTokenSale.deployed();
        }).then(function(instance){
            tokenSaleInstance = instance;
            return tokenInstance.transfer(tokenSaleInstance.address,tokensAvailable, {from:admin})
        }).then(function(receipt){
            numberOfTokens = 10;
            var value = numberOfTokens*tokenPrice;
            return tokenSaleInstance.buyTokens(numberOfTokens,{from: buyer, value: value});
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1, 'ativa um evento');
            assert.equal(receipt.logs[0].event, 'Sell', '"Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'Conta que compra');
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'valor a ser transferido');
            return tokenSaleInstance.tokenSold();
        }).then(function(amount){
            assert.equal(amount.toNumber(),numberOfTokens, 'Incrementa o numero de tokens vendidos');
            return tokenInstance.balanceOf(buyer)
        }).then(function(balance){
            assert.equal(balance.toNumber(), numberOfTokens, 'teste')
            return tokenInstance.balanceOf(tokenSaleInstance.address)
        }).then(function(balance){
            assert.equal(balance.toNumber(),tokensAvailable - numberOfTokens, 'teste')
            return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: 1});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'Valor tem que ser igual ao numero de tokens em wei');
            return tokenSaleInstance.buyTokens(800000, { from: buyer, value: numberOfTokens*tokenPrice});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'Não pode comprar mais que o disponivel');
        });
    });

    it('Finalizar Token Sale', function(){
        return PudimToken.deployed().then(function(instance){
            //Pegar tokenInstance
            tokenInstance = instance;
            return PudimTokenSale.deployed();
        }).then(function(instance){
            //Pegar tokenSaleInstance
            tokenSaleInstance = instance;
            //Tentar Encerrar a venda sem ser ADM
        return tokenSaleInstance.endSale({from: buyer});
        }).then(assert.fail).catch(function(error){
            assert(error.toString().indexOf('revert') >= 0, 'Precisa ser o ADM');
            //Tentar Encerrar a venda sendo ADM
            return tokenSaleInstance.endSale({from: admin})
        }).then(function(receipt){
            return tokenInstance.balanceOf(admin);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 999990, 'Retorna os tokens não vendidos ao adm')
            //Verifica se token price foi resetado e SelfDistruct foi chamado
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(price){
            assert.equal(price.toNumber(), 0, 'TokenPrice foi resetado')
        });
    });
})

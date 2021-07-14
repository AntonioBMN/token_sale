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
            assert.equal(symbol, 'PDT', 'Tem o simbolo correto');
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard, 'PDT Token v1.0', 'Tem o padrão correto')
        })
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
    it('Transferiu o token do dono', function(){
        return PudimToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1],999999999);
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0, 'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1],250000, {from: accounts[0] });
        }).then(function(success){
            assert.equal(success, true, 'Retorna true')
            return tokenInstance.transfer(accounts[1], 250000, {from: accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1, 'ativa um evento');
            assert.equal(receipt.logs[0].event, 'Transfer', '"Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'Conta que envia');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'conta que recebe');
            assert.equal(receipt.logs[0].args._value, 250000, 'valor a ser transferido');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance){
            assert.equal(balance.toNumber(),250000, 'Adiciona a quantidade a conta que recebe');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(),750000, 'Diminui a quantidade da conta que doa');
        })
    })
    it('Aprova tokens para transferencia', function(){
        return PudimToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1],100);
        }).then(function(success){
            assert.equal(success, true, 'retorna true')
            return tokenInstance.approve(accounts[1],100);
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1, 'Ativa um evento');
            assert.equal(receipt.logs[0].event, 'Approval', '"Approval" event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'Conta que envia');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'Conta que recebe');
            assert.equal(receipt.logs[0].args._value, 100, 'Valor a ser transferido');
            return tokenInstance.allowance(accounts[0],accounts[1])
        }).then(function(allowance){
            assert.equal(allowance.toNumber(),100, 'Aprovando transferir 100');
        })
    })

    it('Aprova tokens para transferFrom', function() {
        return PudimToken.deployed().then(function(instance){
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
        }).then(function(receipt) {
            return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
        }).then(function(receipt) {
            return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {from: spendingAccount});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'Não pode transferir mais do que tem na conta');
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount});
        }).then(assert.fail).catch(function(error){
            assert(error.toString().indexOf('revert') >= 0, 'Não pode transferir mais do que tem na conta');
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then(function(success){
            assert.equal(success,true);
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1, 'Ativa um evento');
            assert.equal(receipt.logs[0].event, 'Transfer', '"Transfer" event');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'Conta que envia');
            assert.equal(receipt.logs[0].args._to, toAccount, 'Conta que recebe');
            assert.equal(receipt.logs[0].args._value, 10, 'Valor a ser transferido');
            return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(),90, 'Verifica se diminuiu da conta que envia')
            return tokenInstance.balanceOf(toAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(),10, 'Verifica se aumentou da conta que recebe')
            return tokenInstance.allowance(fromAccount,spendingAccount);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(),0, 'Verifica se diminuiu da Allowance');
        })
    });
});
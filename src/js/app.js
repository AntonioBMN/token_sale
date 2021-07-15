App = {
    web3Provider: null,
    contracts:{},
    account: '0x0',
    loading: false,
    tokenPrice: 10000000000000,
    tokensSold: 0,
    tokensAvailable:750000,
    init: function(){
        console.log("Inicializando...")
        return App.initWeb3();
    },

    initWeb3: function(){
        if(typeof web3 !== 'undefined'){
            // Se a metamask ja dispõe de uma instancia web3
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // Especifica a instancia padrão se não tiver nenhuma web3
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        
        return App.initContracts();
    },
    //Inicia os contratos
    initContracts: function(){
        $.getJSON("PudimTokenSale.json",function(pudimTokenSale){
            App.contracts.PudimTokenSale = TruffleContract(pudimTokenSale);
            App.contracts.PudimTokenSale.setProvider(App.web3Provider);
            App.contracts.PudimTokenSale.deployed().then(function(pudimTokenSale){
                console.log("Pudim Token Sale address: ", pudimTokenSale.address)
            });
            }).done(function(){
                $.getJSON("PudimToken.json",function(pudimToken){
                    App.contracts.PudimToken = TruffleContract(pudimToken);
                    App.contracts.PudimToken.setProvider(App.web3Provider);
                    App.contracts.PudimToken.deployed().then(function(pudimToken){
                        console.log("Pudim Token address: ", pudimToken.address)
                    });
                    App.listenForEvents();
                    return App.render();
            });
        });
    },

    listenForEvents: function(){
        App.contracts.PudimTokenSale.deployed().then(function(instance){
            instance.Sell({}, {
                fromBlock: 0,
                toBlock: 'latest',
            }).watch(function(error, event){
                console.log("event triggered", event);
                App.render();
            })
        })
    },


    render: function(){
        if(App.loading){
            return;
        }
        App.loadind = true;
        var loader = $('#loader');
        var content = $('#content');
        loader.show()
        content.hide();
        // Carregar info da account
        web3.eth.getCoinbase(function(err, account){
            if(err === null){
                console.log("account:", account);
                App.account = account;
                $('#accountAddress').html("Your Account:" + account);
            }
        })
        App.contracts.PudimTokenSale.deployed().then(function(instance){
            pudimTokenSaleInstance  = instance;
            return pudimTokenSaleInstance.tokenPrice();
        }).then(function(tokenPrice){
            App.tokenPrice = tokenPrice;
            $('.token-price').html(web3.fromWei(App.tokenPrice,"ether").toNumber());
            return pudimTokenSaleInstance.tokenSold()
        }).then(function(tokensSold){
            App.tokensSold = tokensSold.toNumber();
            $('.tokens-sold').html(App.tokensSold);
            $('.tokens-available').html(App.tokensAvailable);

            var progressPercent = (App.tokensSold / App.tokensAvailable) * 100;
            $('#progress').css('width', progressPercent + '%');


            App.contracts.PudimToken.deployed().then(function(instance){
                pudimTokenInstance = instance;
                return pudimTokenInstance.balanceOf(App.account);
            }).then(function(balance){
                $('.pudim-balance').html(balance.toNumber());
                App.loading = false;
                loader.hide();
                content.show();
            })

        })
    },

    buyTokens: function(){
        $('#content').hide();
        $('loader').show();
        var numberOfTokens = $('#numberOfTokens').val();
        App.contracts.PudimTokenSale.deployed().then(function(instance){
            return instance.buyTokens(numberOfTokens,{
                from: App.account,
                value: numberOfTokens * App.tokenPrice,
                gas: 100000
            });
        }).then(function(result){
            console.log("tokens comprados: ");
            $('form').trigger('reset');

        })
    }
}

$(function(){
    $(window).load(function(){
        App.init();
    })
});


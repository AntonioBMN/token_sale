const PudimToken = artifacts.require("./PudimToken.sol");
const PudimTokenSale = artifacts.require("./PudimTokenSale.sol");

module.exports = function (deployer) {
  deployer.deploy(PudimToken,1000000).then(function(){
    var tokenPrice = 10000000000000;
    return deployer.deploy(PudimTokenSale, PudimToken.address, tokenPrice);
  });
};

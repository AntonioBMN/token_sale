const PudimToken = artifacts.require("./PudimToken.sol");

module.exports = function (deployer) {
  deployer.deploy(PudimToken,1000000);
};

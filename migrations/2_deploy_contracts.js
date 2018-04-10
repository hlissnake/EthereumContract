var Owned = artifacts.require("./Owned.sol");
var MultiAuthAccount = artifacts.require("./MultiAuthAccount.sol");

module.exports = function(deployer) {
  deployer.deploy(Owned);
  deployer.link(Owned, MultiAuthAccount);
  deployer.deploy(MultiAuthAccount).then(function(instance){
    console.log(instance.address);
  });
};
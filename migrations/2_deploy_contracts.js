var Owned = artifacts.require("./Owned.sol");
var MetaMultiAuthAccount = artifacts.require("./MetaMultiAuthAccount.sol");

module.exports = function(deployer) {
  deployer.deploy(Owned);
  deployer.link(Owned, MetaMultiAuthAccount);
  deployer.deploy(MetaMultiAuthAccount).then(function(instance){
    console.log(instance.address);
  });
};
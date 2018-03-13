var Migrations = artifacts.require("./Migrations.sol");
var CrowdFunds = artifacts.require("./CrowdFunds.sol");

module.exports = function(deployer) {
  // deployer.deploy(Migrations);
  deployer.deploy(CrowdFunds).then(function(instance){
    console.log(instance.address);
  });
};

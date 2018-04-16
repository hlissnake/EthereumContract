# EthereumContract

Demo 演示步骤，使用Remix来模拟测试，后期会放置在Private network测试

## CrowdFunds 众筹合约(AA付款)

* AA发起人调用 createCrowd，发起AA众筹;
* 根据发起人Address作为众筹ID，查看公共变量nextFund，下一个付款人应付Ether数量
* AA付款参与人调用 contribute 接口，付款相应Ether数量
* 可以多个参与人调用接口，但每个人只能调用一次
* 已经付款的人，可以调用withdraw接口，返还AA平分后，退换的Ether
* 后续加一个crowdEnd接口，合约发起人调用，结束AA众筹，并提取合约内所有Ether

## Meta Multi signature contract. 多重签名+无GAS Meta tx

### Building process

* `truffle compile`
* `testrpc -m "'artist wish disease fever stairs grit organ reflect put estate either beach'"`
* `truffle migrate --network private`
* `npm run build` 
* `npm start`

### Operating process

* Open `http://127.0.0.1:8080/web/multiauth.html`
* First, using owner address `0x390d55318c64592c58636ac82fea4f16a84ee34a` to add auther address `0x9097F0B0aA1de326F3431703a97932D503cb13EE`
* Then, specify the destination address `0xcA67856A888dd0eDf2d1Dd17A8d96374A8F9bA86` and the ethers amount want to send
* Switch to auther's account `0x9097F0B0aA1de326F3431703a97932D503cb13EE` then sign those transaction message
* Finally, switch to the first owner account `0x390d55318c64592c58636ac82fea4f16a84ee34a`, trigger tx with pre-signed data


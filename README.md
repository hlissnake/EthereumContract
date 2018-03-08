# EthereumContract

Demo 演示步骤，建议使用Remix来模拟测试，后期会放置在Private network测试

## CrowdFunds 众筹合约(AA付款)

* AA发起人先创建合约，预付所有款项;
* 查看公共变量nextFund，下一个付款人应付Ether数量
* AA付款参与人调用 payfund 接口，付款相应Ether数量
* 可以多个参与人调用接口，但每个人只能调用一次
* 已经付款的人，可以调用withdraw接口，返还AA平分后，退换的Ether
* 后续加一个crowdEnd接口，合约发起人调用，结束AA众筹，并提取合约内所有Ether

### To be continue

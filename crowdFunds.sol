pragma solidity ^0.4.16;

contract Crowdfunds {
    struct Fund {
        address funder;
        uint withDrawBalance;
    }

    // 众筹预付款
    uint public initalFund;
    // 下一个众筹参与人应付的额度
    uint public nextFund;
    Fund[] private funders;

    // 众筹发起人发起AA合约，发起人预付所有的费用
    function Crowdfunds() public payable {
        initalFund = msg.value;
        nextFund = msg.value / 2;
        funders.push(Fund({
            funder: msg.sender, 
            withDrawBalance: 0
        }));
    }

    // 众筹参与者付款，所付款会自动补贴其他投资者，以达到平分
    function payfund() public payable {
        require(msg.value == nextFund);

        uint length = funders.length;

        for (uint i = 0; i < length; i++) {
            Fund storage fund = funders[i];
            require(msg.sender != fund.funder);

            fund.withDrawBalance += (nextFund / length);
        }

        funders.push(Fund({
            funder: msg.sender, 
            withDrawBalance: 0
        }));
        nextFund = initalFund / (funders.length + 1);
    }

    // 众筹参与者可随时提现，将AA平分费用后的差价退回
    function withdraw() public {
        for (uint i = 0; i < funders.length; i++) {
            Fund storage  fund = funders[i];
            
            if (msg.sender == fund.funder) {
                uint amount = fund.withDrawBalance;
                fund.withDrawBalance = 0;
                if (!msg.sender.send(amount)) {
                    fund.withDrawBalance = amount;
                    return;
                }
            }
        }
    }
}

pragma solidity ^0.4.17;

contract Crowdfunds {
    struct Fund {
        address funder;
        uint withDrawBalance;
    }
    
    struct Crowd {
        // 众筹预付款
        uint initalFund;
        // 下一个众筹参与人应付的额度
        uint nextFund;
        Fund[] funders;
    }

    uint8 private decimals;
    mapping(address => Crowd) private crowds;
    
    function Crowdfunds() public {
        decimals = 18;
    }

    // 众筹发起人发起AA合约，发起人预付所有的费用
    function createCrowd(uint initalAmountInEther) public {
        uint initalFund = initalAmountInEther * 10 ** uint(decimals);
        
        crowds[msg.sender].initalFund = initalFund;
        crowds[msg.sender].nextFund = initalFund / 2;
        crowds[msg.sender].funders.push(Fund({
            funder: msg.sender, 
            withDrawBalance: 0
        }));
    }

    // 众筹参与者付款，所付款会自动补贴其他投资者，以达到平分
    function contribute(address initalFunderAddress) public payable {
        Crowd storage crowd = crowds[initalFunderAddress];
        Fund[] storage funders = crowd.funders;
        uint nextFund = crowd.nextFund;
        
        require(msg.value == nextFund);

        uint length = funders.length;

        for (uint i = 0; i < length; i++) {
            Fund storage fund = funders[i];

            fund.withDrawBalance += (nextFund / length);
        }

        funders.push(Fund({
            funder: msg.sender,
            withDrawBalance: 0
        }));
        crowd.nextFund = crowd.initalFund / (funders.length + 1);
    }

    // 众筹参与者可随时提现，将AA平分费用后的差价退回
    function withdraw(address initalFunder) public {
        Crowd storage crowd = crowds[initalFunder];
        
        for (uint i = 0; i < crowd.funders.length; i++) {
            Fund storage fund = crowd.funders[i];
            
            if (msg.sender == fund.funder) {
                uint amount = fund.withDrawBalance;
                fund.withDrawBalance = 0;
                msg.sender.transfer(amount);
            }
        }
    }
    
    function checkBalance(address initalFunder) public view returns(uint) {
        Crowd memory crowd = crowds[initalFunder];
        
        for (uint i = 0; i < crowd.funders.length; i++) {
            Fund memory fund = crowd.funders[i];
            
            if (msg.sender == fund.funder) {
                return fund.withDrawBalance;
            }
        }
    }

    function checkNextFund(address initalFunder) public view returns(uint) {
        Crowd memory crowd = crowds[initalFunder];
        return crowd.nextFund;
    }
    
    function () public payable {
        revert();
    }
}
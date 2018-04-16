pragma solidity ^0.4.18;

import "./Owned.sol";

contract MultiAuthAccount is Owned {
    
    event signatureVerified(address signer, bool result);
    
    struct Transact {
        address destination;
        bytes data;
        uint value;
        bool approved;
    }
    // Note: This is a local nonce.
    // Different from the nonce defined w/in protocol.
    mapping(address => uint) private nonce;
    mapping(address => bool) private authorizers;
    mapping(bytes32 => Transact) transacts;

    modifier isAuthorizer(address authorizer) {
        require(authorizers[authorizer]);
        _;
    }
    
    function MultiAuthAccount() public payable {
        authorizers[msg.sender] = true;
    }
    
    function addAuthKey(address newAuthorizer) public onlyOwner() {
        authorizers[newAuthorizer] = true;
    }
    
    function createTransaction(address destination, bytes data) public payable onlyOwner() returns(bytes32) {
        bytes32 transactId = keccak256(now);
        transacts[transactId] = Transact(destination, data, msg.value, false);
        
        return transactId;
    }

    function approveTransaction(bytes32 transactId) public isAuthorizer(msg.sender) {
        Transact storage transact = transacts[transactId];
        transact.approved = true;
        
        if (transact.value > 0) {
            transact.destination.transfer(transact.value);
        } else {
            require(transact.destination.call(transact.data));
        }
        
        delete transacts[transactId];
    }
}

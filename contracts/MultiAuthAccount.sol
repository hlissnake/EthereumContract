pragma solidity ^0.4.18;

contract MultiAuthAccount {
    
    event signatureVerified(address signer, bool result);
    
    struct Transact {
        address destination;
        bytes data;
        uint value;
        bool approved;
    }
    
    address public owner;
    address[] private authorizers;
    mapping(bytes32 => Transact) transacts;
    
    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }
    
    modifier isNotOwner() {
        require(msg.sender != owner);
        _;
    }
    
    function MultiAuthAccount() public payable {
        owner = msg.sender;
        authorizers.push(msg.sender);
    }
    
    function addAuthKey(address newAuthorizer) public isOwner() {
        authorizers.push(newAuthorizer);
    }
    
    function createTransact(address destination, bytes data) public payable isOwner() returns(bytes32) {
        bytes32 transactId = keccak256(now);
        transacts[transactId] = Transact(destination, data, msg.value, false);
        
        return transactId;
    }
    
    function approveTransact(bytes32 transactId) public isNotOwner() {
        Transact storage transact = transacts[transactId];
        transact.approved = true;
        
        if (transact.value > 0) {
            transact.destination.transfer(transact.value);
        } else {
            require(transact.destination.call(transact.data));
        }
        
        delete transacts[transactId];
    }
    
    function verifySignature(address signer, bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public pure returns (bool) {
        return signer == ecrecover(msgHash, v, r, s);
    }
}

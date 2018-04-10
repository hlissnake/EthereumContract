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
    
    mapping(address => bool) private authorizers;
    mapping(bytes32 => Transact) transacts;

    modifier isAuthorizer(address authorizer) {
        require(authorizers[authorizer]);
        _;
    }
    
    function MultiAuthAccount() public payable {
        owner = msg.sender;
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
    
    // ------------------------------------------------------------------------
    // Execute transaction with meta transaction signatures
    // ------------------------------------------------------------------------
    function executeTransaction(address destination, bytes executeData, address signer, bytes signerData, uint8 v, bytes32 r, bytes32 s) public payable onlyOwner() isAuthorizer(signer){
        require(verifySignature(signer, keccak256(signerData), v, r, s));
        require(compareBytes(executeData, signerData));

        require(destination.call(executeData));
    }

    function compareBytes(bytes a, bytes b) private pure returns(bool) {
        require(a.length == b.length);
        uint len = a.length;
        for(uint i = 0; i < len; i++) {
            require(a[i] == b[i]);
        }
        return true;
    }

    function verifySignature(address signer, bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public pure returns (bool) {
        return signer == ecrecover(msgHash, v, r, s);
    }
}

pragma solidity ^0.4.18;

import "./Owned.sol";

contract MetaTxController is Owned {
    
    // Note: This is a local nonce.
    // Different from the nonce defined w/in protocol.
    mapping(address => uint) private nonce;
    mapping(address => bool) private authorizers;

    modifier isAuthorizer(address authorizer) {
        require(authorizers[authorizer]);
        _;
    }
    
    function MetaTxController() public payable {
        authorizers[msg.sender] = true;
    }
    
    function addAuthKey(address newAuthorizer) public onlyOwner() {
        authorizers[newAuthorizer] = true;
    }
    
    // ------------------------------------------------------------------------
    // Execute transaction with meta transaction signatures
    // meta transaction data should be like this: sender :: destination :: auther :: value :: nonce
    // ------------------------------------------------------------------------
    function executeTransaction(address destination, address auther, uint value, uint8 v, bytes32 r, bytes32 s) public onlyOwner() isAuthorizer(auther){
        
        bytes32 hash = sha3Hash(msg.sender, destination, auther, value);
        require(auther == recoverAddress(hash, v, r, s));
        nonce[auther]++;

        destination.transfer(value);
    }

    function getNonce(address auther) public view isAuthorizer(msg.sender) returns(uint) {
        return nonce[auther];
    }

    // ------------------------------------------------------------------------
    // meta transaction data should be like this: sender :: destination :: auther :: value :: nonce
    // ------------------------------------------------------------------------
    function sha3Hash(address sender, address destination, address auther, uint value) public view isAuthorizer(msg.sender) returns(bytes32) {
        return keccak256(byte(0x19), byte(0), sender, destination, auther, value, nonce[auther]);
    }

    function recoverAddress(bytes32 msgHash, uint8 v1, bytes32 r, bytes32 s) public pure returns (address) {
        uint8 v = uint8(v1);
        return ecrecover(msgHash, v, r, s);
    }

    // ------------------------------------------------------------------------
    // Purchase ETH
    // ------------------------------------------------------------------------
    function () public payable {

    }
}

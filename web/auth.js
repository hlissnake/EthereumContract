// Change accountToSignWith to the address of your account.
var web3;

var message = 'Hello, This is my identity.'
var authContract, accountToSignWith;
var contractAddress = '0x810622c2aae19e2d77b0c4a054c9551c5fe4fd0c'; // on Ropsten

var contractABI = [{ "constant": true, "inputs": [{ "name": "signer", "type": "address" }, { "name": "msgHash", "type": "bytes32" }, { "name": "v", "type": "uint8" }, { "name": "r", "type": "bytes32" }, { "name": "s", "type": "bytes32" }], "name": "VerifySignature", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }];


// eth_sign calculated the signature over keccak256("\x19Ethereum Signed Message:\n" + len(givenMessage) + givenMessage)))
// this gives context to a signature and prevents signing of transactions.
function messageHash(msg) {
    return web3.sha3('\x19Ethereum Signed Message:\n' + msg.length + msg);
}

function verifyHandler(err, result) {
    if (!err) {
        console.log('  Address matched:', result);
    } else {
        console.error('Could not recover address:', err);
    }
}

function signHandler(err, signature) {
    if (!err) {
        console.log('Signature:', signature);
        signature = signature.substr(2);
        r = '0x' + signature.substr(0, 64);
        s = '0x' + signature.substr(64, 64);
        v = '0x' + signature.substr(128, 2)

        console.log('        r:', r)
        console.log('        s:', s)
        console.log('        v:', v)

        authContract.VerifySignature(accountToSignWith, messageHash(message), v, r, s, verifyHandler);
    } else {
        console.error('Coult not sign message:', err);
    }
}

window.addEventListener('load', function () {
    if (typeof web3 !== undefined) {
        web3 = new Web3(web3.currentProvider);
    } else {
        web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
    }

    accountToSignWith = web3.eth.defaultAccount;
    console.log(accountToSignWith);

    authContract = web3.eth.contract(contractABI).at(contractAddress);

    console.log('  Message to sign:', message);
    console.log('  Message sha3 hash:', messageHash(message));
    console.log('Sign with account:', accountToSignWith);
    console.log();

    document.getElementById('sign').addEventListener('click', function () {
        web3.eth.sign(accountToSignWith, messageHash(message), signHandler);
    });
});
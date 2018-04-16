import MetaMultiAuthAccountABI from '../dist/abi/MetaMultiAuthAccount.json';

var authContract;
var contractAddress = '0xd92fcfb5567639158c88d1ecb91de36e7573f5f9'; // testrpc '0x0170d9975f97435fe9cd032918f104374ec9b24f'; // on Ropsten 

var contractABI = MetaMultiAuthAccountABI;

window.addEventListener('load', function () {
    // if (typeof web3 !== undefined) {
    //     web3 = new Web3(web3.currentProvider);
    // } else {
        web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
    // }

    authContract = web3.eth.contract(contractABI).at(contractAddress);
    console.log();

    document.getElementById('addauth').addEventListener('click', function () {
        console.log('current account: ', web3.eth.defaultAccount);
        if(document.getElementById('auther').value) {
            authContract.addAuthKey(document.getElementById('auther').value, function(err){
                if (!err) {
                    console.log('  Address added:');
                } else {
                    console.error('Could not add address:', err);
                }
            });
        }
        document.getElementById('sender').value = web3.eth.defaultAccount;
    });
    
    document.getElementById('sign').addEventListener('click', function () {
        console.log('current account: ', web3.eth.defaultAccount);
        // eth_sign calculated the signature over keccak256("\x19Ethereum Signed Message:\n" + len(givenMessage) + givenMessage)))
        // data should be like this: sender :: destination :: auther :: value :: nonce
        const sender = document.getElementById('sender').value;
        const destination = document.getElementById('destination').value;
        const etherValue = document.getElementById('ether').value * Math.pow(10, 18);
        const accountToSignWith = web3.eth.defaultAccount;

        // const dataToHash = `${sender}::${destination}::${accountToSignWith}::${etherValue}::1`;
        // console.log(' dataToHash: ', dataToHash);

        authContract.sha3Hash(sender, destination, accountToSignWith, etherValue, function(err, hash) {
            if (!err) {
                console.log('Keccak256 hash:', hash);
                const dataToSign = hash;//web3.sha3('\x19Ethereum Signed Message:\n' + msg.length + msg);

        web3.eth.sign(accountToSignWith, dataToSign, function(err, signature) {
            if (!err) {
                console.log('Signature:', signature);
                document.getElementById('signer').value = accountToSignWith;
                document.getElementById('signedData').value = signature;
            } else {
                console.error('Coult not sign message:', err);
            }
        });
            } else {
                console.error('Coult not hash message:', err);
            }
        });
    });
    
    document.getElementById('execute').addEventListener('click', function () {
        let signature = document.getElementById('signedData').value;
        signature = signature.substr(2);
        const r = '0x' + signature.substr(0, 64);
        const s = '0x' + signature.substr(64, 64);
        const v = '0x' + signature.substr(128, 2)

        console.log('        r:', r)
        console.log('        s:', s)
        console.log('        v:', v)

        const sender = document.getElementById('sender').value;
        const destination = document.getElementById('destination').value;
        const etherValue = document.getElementById('ether').value * Math.pow(10, 18);
        const accountToSignWith = document.getElementById('signer').value;
        // const dataToHash = `${sender}::${destination}::${accountToSignWith}::${etherValue}::1`;
        
        // const dataToSign = web3.sha3('\x19Ethereum Signed Message:\n' + dataToHash.length + dataToHash);
        // console.log(' dataToSign 2: ', dataToSign);

        authContract.executeTransaction.sendTransaction(
            destination, 
            accountToSignWith,
            v, r, s, 
            {
                value: etherValue, 
                gas: 210000
            },
        function(err) {
            if (!err) {
                console.log('  execute successful');
            } else {
                console.error('Could not recover address:', err);
            }
        });
    });
});

// Ether 4
// "0x3740844a0662c1f269d6d16790c54cd988612d4271f3b2aeb1d855775dede99d", "0x01", "0x8b5fecce54dee5294747a7162ae8d5519786e2598cf16ab564f952dd49894741", "0x39a9aa2d485ff5583b342d4330541efdc33e3b8d50bb9d00b92dbe9fd4036bf7"
// "0xcA67856A888dd0eDf2d1Dd17A8d96374A8F9bA86", "0x9097f0b0aa1de326f3431703a97932d503cb13ee", "0x00", "0x990be594a4d8cd4f2235254dd01254a185e74a59d6aafb61d3e98aa4cf546961", "0x00641bf51ed1ef4e86e52f7aaf1a65a42face922b098494507b22a88b7902652"
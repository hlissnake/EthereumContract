var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var eth = require('./eth');
var master = require('./config.json').master;

app.use(bodyParser.json()); // for parsing application/json

// POST method route
app.post('/relayTransaction', function (req, res) {
    // var voucherAccount = web3.eth.accounts.create();
    // console.log(JSON.stringify(voucherAccount));
    var voucherAccount = eth.createNewVoucher();
    eth.sendTransaction(master.address, voucherAccount.address, 1, master.key)
        .then(function(){
            res.send('Create voucher : ' + JSON.stringify(voucherAccount));
        }).catch(function() {
            res.send('transaction error');
        });
});

app.listen(3000, () => console.log('Meta transaction relay service listening on port 3000!'));

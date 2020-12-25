'use strict';

var models = require('../models');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
var crypto = require('crypto');

exports.generate_keys = function(req, res) {
    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');
    res.end(JSON.stringify({publicKey: publicKey, privateKey: privateKey}));
};

exports.save_keys = async function (req, res) {
    if (typeof req.body !== 'undefined') {
        console.log(req.body);
        var user = await models.User.findOne({
            where: { email: req.session.email }
        })
        console.log(user);
        var wallet =  await models.Wallet.findOne({
            where: {user_id: user.id}
        });
        if (wallet == undefined) {
            await models.Wallet.create({
                amount: 10000,
                publicKey: req.body.publicKey,
                privateKey: req.body.privateKey,
                user_id: user.id
            });
        } else {
            await wallet.update({
                publicKey: req.body.publicKey,
                privateKey: req.body.privateKey,
            });
        }
        console.log(wallet);
        res.end(JSON.stringify({code : 200, message: "Keys sucessful saved !"}));
    }
};

exports.wallet_page = function (req, res) {
    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');
    res.render('wallet_keys_generator', {user_email: req.session.email, publicKey:  publicKey, privateKey: privateKey});
};

exports.wallet_getbalance = async function (req, res) {
    if (typeof req.body !== 'undefined') {
        var user = await models.User.findOne({
            where: { email: req.session.email }
        });
        var wallet =  await models.Wallet.findOne({
            where: {user_id: user.id}
        });
        if (wallet == undefined) {
            res.end(JSON.stringify({code: 401, message:"Error : wallet undefined "}));
        }
        return res.end(JSON.stringify({code: 200, body: wallet.amount}));
    }
};

exports.wallet_transaction = async function (req, res) {
    if (typeof req.body !== 'undefined') {
        var user = await models.User.findOne({
            where: { email: req.session.email }
        });
        var wallet =  await models.Wallet.findOne({
            where: {user_id: user.id}
        });
        if (wallet == undefined) {
            res.end(JSON.stringify({code: 401, message:"Error : wallet undefined "}));
        }
        const publicKey = wallet.publicKey;
        const privateKey = wallet.privateKey;
        res.render('wallet_transaction', {user_email: req.session.email, publicKey:  publicKey, privateKey: privateKey});
    }
};

function calculateHash(value){
    var hash = crypto.createHash('sha512');
    var data = hash.update(value.fromAddress + value.toAddress + value.amount.toString(), 'utf-8');
    var hash_rslt = data.digest('hex');
	return (hash_rslt);
}

exports.wallet_verif_sign = async function(req, res) {
    try {
        if (typeof req.body !== 'undefined') {
            var valid = "false";
            var publicKey = req.body.publicKey;
            var amount = req.body.amount;
            var from = req.body.from;
            var to = req.body.to;
            var signature = req.body.signature;
            if (from === "SYSTEM")
                res.end(JSON.stringify({code: 200, body: true}));
            if (!signature || signature.length === 0) {
                res.end(JSON.stringify({code: 200, body: "false"}));
            }
            var hash = crypto.createHash('sha512');
            let key = ec.keyFromPublic(from, 'hex');
            var data = hash.update(from + to + String(amount), 'utf-8').digest('hex');
            console.log('hash: '+ data);
            console.log('publickey: '+ JSON.stringify(from));
            console.log('signature: '+ JSON.stringify(signature));
            valid = key.verify(data, signature);
            console.log('valid: ' + valid);
            res.end(JSON.stringify({code: 200, body: valid}));
        }
    } catch (err) {
        console.error(err);
    }
}

exports.wallet_sign_transaction = async function (req, res) {
    if (typeof req.body !== 'undefined') {
        var user = await models.User.findOne({
            where: { email: req.session.email }
        });
        var wallet =  await models.Wallet.findOne({
            where: {user_id: user.id}
        });
        if (wallet == undefined) {
            res.end(JSON.stringify({code: 401, message:"Error : wallet undefined "}));
        }
        const publicKey = wallet.publicKey;
        if (publicKey !== req.body.fromAddress){
            res.end(JSON.stringify({code: 401, message: "Error : You cannot sign transactions for other wallets !"}));
        }
        const hashTx = calculateHash(req.body);
        const sig = ec.sign(hashTx, wallet.privateKey,{canonical: true});
        const signature = sig.toDER('hex');
        console.log(signature);
        res.end(JSON.stringify({code: 200, body: signature}));
    }
};

exports.checkbalans = async function(req, res) {
    var transactions = req.body.transactions;
    var wallets = await models.Wallet.findAll()
    var balances = new Map();
    wallets.map(wallet => {balances.set(wallet.dataValues.publicKey, wallet.dataValues.amount)});
    var verif = new Promise((resolve, reject) => {
        for (const tx of transactions) {
            console.log("yus");
            if (tx.From == "SYSTEM")
                continue;
            if (!balances.has(tx.From))
                resolve("false");
            balances.set(tx.From, balances.get(tx.From) - tx.Amount);
            if (balances.get(tx.From) < 0) {
                resolve("false");
            }
        }
        console.log("ey");
        resolve("true");
    })
    verif.then(result => {console.log(result); res.send(result)});
}

exports.checkhash = function(req, res) {
    var block = req.body;

    var hash = crypto.createHash("sha256").update(block.block + JSON.stringify(block.transactions) + block.prev + block.nonce).digest("hex");

    if (hash == block.hash)
        res.status(200).end();
    else
        res.status(400).end();
}

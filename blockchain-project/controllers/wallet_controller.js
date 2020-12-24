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
            var publicKey = req.body.publicKey;
            var amount = req.body.amount;
            var from = req.body.from;
            var to = req.body.to;
            var signature = req.body.signature;
            if(!signature || signature.length === 0) {
                res.end(JSON.stringify({code: 200, body: "false"}));
            }
            const pK = ec.keyFromPublic(from, 'hex');
            var hash = crypto.createHash('sha512');
            var data = hash.update(from + to + amount.toString(), 'utf-8');
            var hash_rslt = data.digest('hex');
            var isValid = pK.verify(hash_rslt, signature);
            res.end(JSON.stringify({code: 200, body: isValid}));
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

exports.wallet_send_node = function (req, res) {
    if (typeof req.body !== 'undefined') {

    }
};

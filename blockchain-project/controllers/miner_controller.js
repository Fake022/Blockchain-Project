var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var session = require('express-session');
var models = require('../models');
var Sequelize = require('sequelize');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const fetch = require('node-fetch');
const crypto = require("crypto");
const bcrypt = require('bcrypt');

async function getTransactions(user) {
    var transactions = await models.Transaction.findAll({
        // where: { user_id: user.id }
    });
    var newTransactions = new Array();
    for (let Tx of transactions) {
        newTransactions.push(Tx.dataValues);
    }
    return (newTransactions);
}

exports.miner_page = async (req, res) => {
    let email = req.session.email;
    var user = await models.User.findOne({
        where: { email: req.session.email }
    });
    var wallet = await models.Wallet.findOne({
        where: { user_id: user.id }
    })
    var transactions =  await getTransactions(user);
    console.log(transactions);
    if (!transactions.find(transaction => transaction.coinbase === true)) {
        var hashTx = crypto.createHash('sha256').update("SYSTEM" + wallet.publicKey + "1000", 'utf-8').digest('hex');
        var sig = ec.sign(hashTx, wallet.privateKey, {canonical: true});
        var signature = sig.toDER('hex');
        transactions.push({id: transactions.length + 1, Amount: 1000, Fee: 0, From: "SYSTEM", To: wallet.publicKey, Signature: signature, coinbase: true});
    }
    res.render('miner', {user_email: email, transactions: transactions, hash: req.query.hash, nonce: req.query.nonce});
};

exports.mine = (req, res) => {
    console.log("body: ", req.body);
    var nonce = 0;
    var block = JSON.stringify(req.body);
    for (let i = 0; ; i++) {
        let toHash = block + i;
        var hash = crypto.createHash("sha256").update(toHash).digest("hex");
        if (hash.startsWith("00")) {
            nonce = i;
            break;
        }
    }
    console.log("final hash:" +  hash + "\nnonce: " + nonce);
    res.status(200).send({hash: hash, nonce: nonce});
};

exports.send = (req, res) => {
    const uri = 'http://localhost:8000/node/new_block';
    var initDetails = {
        method: 'post',
        body: JSON.stringify(req.body),
        headers: {"Content-Type": "application/json"}
    }
    console.log(initDetails.body);

    fetch(uri, initDetails).then(response => {
    if (response.status == 200) {
        return response.json();
    } else {
        console.log('Error Send: something went wrong ...');
        res.status(400).end();
    }
    }).then(res => {
        console.log("sent");
        res.status(200).end();
    })
}

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
    var transactions = await models.Usertransaction.findAll({
        where: { user_id: user.id }
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
    var blockchain = await models.Block.findAll({
        where: { user_id: user.id }
    })
    var block = 0;
    var prev = "0000000000000000000000000000000000000000000000000000000000000000";
    for (let Bk of blockchain) {
        if (Bk.block > block) {
            block = Bk.block;
            prev = Bk.hash;
        }
    }
    block++;
    var transactions =  await getTransactions(user);
    console.log(transactions);
    if (!transactions.find(transaction => transaction.coinbase === true)) {
        var hashTx = crypto.createHash('sha256').update("SYSTEM" + wallet.publicKey + "1000", 'utf-8').digest('hex');
        var sig = ec.sign(hashTx, wallet.privateKey, {canonical: true});
        var signature = sig.toDER('hex');
        transactions.push({id: transactions.length + 1, Amount: 1000, Fee: 0, From: "SYSTEM", To: wallet.publicKey, Signature: signature, coinbase: true});
    }
    res.render('miner', {
        user_email: email,
        transactions: transactions,
        block: block,
        prev: prev,
        hash: req.query.hash,
        nonce: req.query.nonce
    });
};

exports.mine = (req, res) => {
    console.log("body: ", req.body);
    var nonce = 0;
    var block = req.body;
    for (let i = 0; ; i++) {
        let toHash = block.block + block.transactions + block.prev + i;
        var hash = crypto.createHash("sha256").update(toHash).digest("hex");
        if (hash.startsWith("00")) {
            nonce = i;
            break;
        }
    }
    console.log("final hash:" +  hash + "\nnonce: " + nonce);
    res.status(200).send({hash: hash, nonce: nonce});
};

exports.send = async (req, res) => {
    let email = req.session.email;
    var user = await models.User.findOne({
        where: { email: req.session.email }
    });
    var block = req.body;
    block.user_id = 0;
    console.log(block);
    var allBlocks = await models.Block.findAll();
    for (let fblock of allBlocks) {
        if (fblock.hash == block.hash) {
            res.status(403).end();
            return;
        }
    }
    if (req.body != null) {
        await models.Block.create(block);
        var transactions = await models.Transaction.findAll();
        var userTransactions = await models.Usertransaction.findAll({where: {user_id: user.id}});
        for (let usertx of userTransactions) {
            for (let tx of transactions) {
                if (usertx.id == tx.id) {
                    tx.destroy();
                    usertx.destroy();
                }
            }
        }
        res.status(200).end();
    } else {
        res.status(400).end();
    }
}

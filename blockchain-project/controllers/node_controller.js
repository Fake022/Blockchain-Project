'use strict';

var models = require('../models');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const crypto = require("crypto");

async function getBlocks(user) {
    var blocks = await models.Block.findAll({
        where: { user_id: user.id }
    });
    var newBlocks = new Array();
    for (let Bk of blocks) {
        newBlocks.push(Bk.dataValues);
    }
    return (newBlocks);
}

async function getNewBlocks(user) {
    var nblocks = await models.Block.findAll({
        where: { user_id: 0 }
    })
    var newBlocks = new Array();
    for (let Bk of nblocks) {
        newBlocks.push(Bk.dataValues);
    }
    return (newBlocks);
}

exports.network_page = function(req, res) {
    let email = req.session.email;
    res.render('node', {user_email: email});
};

exports.get_all_block = function(req, res){
    res.render('', {});
};

exports.add_new_transaction = async function(req, res){
    if (req.body !== null) {
        await models.Transaction.create({
            Amount: req.body.amount,
            Fee: req.body.fee,
            From: req.body.fromAddress,
            To: req.body.toAddress,
            Signature: req.body.Signature,
        });
        res.end(JSON.stringify({code : 200, message: "Transaction sucessful saved !"}));
    } else {
        res.end(JSON.stringify({code : 400, message: "Error : parameters was null"}));
    }
};

exports.personal_blockchain = async function(req, res){
    let email = req.session.email;
    var user = await models.User.findOne({
        where: { email: email }
    });
    var blocks = await getBlocks(user);
    var nblocks = await getNewBlocks();
    for (let bk of nblocks)
        bk.transactions = JSON.parse(bk.transactions);
    console.log(nblocks);
    res.render('node/personal_blockchain', {user_email: req.session.email, blocks: blocks, nblocks: nblocks});
};

exports.new_transaction = async function(req, res) {
    if (typeof req.body ==! 'undefined') {
        var transactions = await models.Transaction.findAll();
        res.render('node/new_transaction', {user_email: req.session.email, transactions: transactions});
    } else {
        res.render('node/new_transaction', {user_email: req.session.email});
    }
};

exports.mempool_transaction = function(req, res) {
    res.render('node/mempool_transaction', {});
};

exports.verify_block = async function(req, res) {
    var email = req.session.email;
    var hash = req.body.hash;
    var user = await models.User.findOne({
        where: { email: email }
    });
    var block = await models.Block.findOne({
        where: { hash: hash }
    });

    block.user_id = user.id;
    await block.save();
    res.status(200).end();
}

exports.checkbalans = function(req, res) {
    res.status(200).send();
}

exports.checksign = function(req, res) {
    res.status(200).send();
}

exports.checkhash = function(req, res) {
    var block = req.body;

    var hash = crypto.createHash("sha256").update(block.block + JSON.stringify(block.transactions) + block.prev + block.nonce).digest("hex");

    if (hash == block.hash)
        res.status(200).end();
    else
        res.status(400).end();
}

'use strict';

var models = require('../models');

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

exports.personnal_blockchain = function(req, res){
    res.render('personal_blockchain', {});
};

exports.new_transaction = async function(req, res) {
    if (typeof req.body ==! 'undefined') {
        var transactions = await models.Transaction.findAlll();
        res.render('node/new_transaction', {user_email: req.session.email, transactions: transactions});
    } else {
        res.render('node/new_transaction',{user_email: req.session.email});
    }
};

exports.mempool_transaction = function(req, res) {
    res.render('node/mempool_transaction', {});
};
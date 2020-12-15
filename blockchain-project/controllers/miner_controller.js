var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var session = require('express-session');
var models = require('../models');
var Sequelize = require('sequelize');
const crypto = require("crypto");
const bcrypt = require('bcrypt');

exports.miner_page = async (req, res) => {
    let email = req.session.email;
    // var transactions =  await models.Transactions.find({
    //     where: {user_id: user.id}
    // });
    var transactions = [];
    res.render('miner', {user_email: email, transactions: transactions, hash: req.query.hash, nonce: req.query.nonce});
};

exports.mine = (req, res) => {
    console.log(req.body);
    var nonce = 0;
    var block = req.body.block + req.body.prev + JSON.stringify(req.session.transactions);
    console.log(block);
    for (let i = 0; ; i++) {
        let toHash = block + i;
        var hash = crypto.createHash("sha256").update(toHash).digest("hex");
        console.log(hash);
        if (hash.startsWith("00")) {
            nonce = i;
            break;
        }
    }
    console.log("final hash:" +  hash + "\nnonce: " + nonce);
    res.end(JSON.stringify({code: 200, hash: hash, nonce: nonce}));
};

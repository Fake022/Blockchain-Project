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
    var transactions = [{
        TxNr: 1,
        amount: 100,
        fee: 10,
        from: "fa7942e2ac45ae0294e2a414c64f7f53",
        to: "766099e79c9a01b047f9ba6f789ab8b3",
        signature: "d1ea59bf8f03b16c60fe26efeb7a359e"
    }];
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
    console.log("send");
}

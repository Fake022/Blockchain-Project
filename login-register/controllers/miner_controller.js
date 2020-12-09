var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var session = require('express-session');
var models = require('../models');
var Sequelize = require('sequelize');
const crypto = require("crypto");
const bcrypt = require('bcrypt');

var minerRoutes = express.Router();

minerRoutes.get('/miner', (req, res) => {
    var mempool2 = [
        {
            TxNr: 0,
            amount: 1000,
            fee: 20,
            from: "f878604855f44bd932fbeeb65b95a901",
            to: "c5317135db810f502b11fd7b86d58b42",
            signature: "haha yes"
        },
        {
            TxNr: 1,
            amount: 360,
            fee: 50,
            from: "6b9b1d73a087acfaab5ee7e28e349c27",
            to: "c5317135db810f502b11fd7b86d58b42",
            signature: "haha no"
        },
        {
            TxNr: 2,
            amount: 420,
            fee: 69,
            from: "f878604855f44bd932fbeeb65b95a901",
            to: "6b9b1d73a087acfaab5ee7e28e349c27",
            signature: "perhaps"
        }
    ];
    // var mempool_promise = models.Transaction.findAll();
    // mempool_promise.then(mempool => {
    //     res.render('miner/miner', {mempool: mempool});
    // });
    var transactions = [
        {
            TxNr: 0,
            amount: 1000,
            fee: 20,
            from: "f878604855f44bd932fbeeb65b95a901",
            to: "c5317135db810f502b11fd7b86d58b42",
            signature: "haha yes"
        },
        {
            TxNr: 1,
            amount: 360,
            fee: 50,
            from: "6b9b1d73a087acfaab5ee7e28e349c27",
            to: "c5317135db810f502b11fd7b86d58b42",
            signature: "haha no"
        }
    ];
    req.session.transactions = transactions;
    res.render('miner/miner', {mempool: mempool2, transactions: req.session.transactions, hash: req.query.hash, nonce: req.query.nonce});
});

minerRoutes.post('/transaction', (req, res) => {
    models.Transaction.create(req.body.transaction);
});

minerRoutes.post('/addtoblock', (req, res) => {
    console.log(req.body.transaction);
    req.session.transactions += req.body.transaction;
})

minerRoutes.post('/miner', (req, res) => {
    var nonce = 0;
    var block = JSON.stringify(req.session.transactions[0])
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
    res.redirect(`/miner?hash=${hash}&nonce=${nonce}`);
});

module.exports = {"MinerRoutes" : minerRoutes};

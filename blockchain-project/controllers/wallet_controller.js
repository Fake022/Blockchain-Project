'use strict';

var models = require('../models');
var Sequelize = require('sequelize');
const cryptoRandomString = require('crypto-random-string');
const { randomBytes } = require('crypto');
const secp256k1 = require('secp256k1')
var secp256 = require('elliptic-curve').secp256k1;


exports.generate_keys = function(req, res) {
    do {
        var privateKey = randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privateKey))
    var publicKey = secp256.getPublicKey(privateKey);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({publicKey: publicKey, privateKey: privateKey}));
};

exports.save_keys = function (req, res) {
    if (req.body ==! null || req.body !== undefined ) {
        var temp = JSON.parse(req.body);
        var matched_users_promise = models.User.findAll({
            where: Sequelize.or({
            email: req.session.email
            })
        });
        matched_users_promise.then(function(users){
            models.User.create({
                privateKey: temp.privateKey,
                publicKey: temp.publicKey
            }).then(function() {
                res.end(JSON.stringify({code : 200, message: "Keys sucessful saved !"}))
            });
        })
    }
};

exports.wallet_page = function (req, res) {
    do {
        var privateKey = randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privateKey))
    var publicKey = secp256.getPublicKey(privateKey.toString('hex'));
    res.render('wallet', {user_email: req.session.email, publicKey:  publicKey, privateKey: privateKey.toString('hex')});   
};
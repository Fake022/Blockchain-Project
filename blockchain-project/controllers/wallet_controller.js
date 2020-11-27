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
    var publicKey = secp256.getPublicKey(privateKey.toString('hex'));
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({publicKey: publicKey, privateKey: privateKey.toString('hex')}));
};

exports.save_keys = async function (req, res) {
    if (req.body ==! null || req.body !== undefined ) {
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
    do {
        var privateKey = randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privateKey))
    var publicKey = secp256.getPublicKey(privateKey.toString('hex'));
    res.render('wallet', {user_email: req.session.email, publicKey:  publicKey, privateKey: privateKey.toString('hex')});   
};
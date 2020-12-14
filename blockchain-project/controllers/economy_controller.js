'use strict';

var models = require('../models');


exports.page = async function(req, res) {
    if (req.body ==! null || req.body !== undefined ) {
        var user = await models.User.findOne({
            where: { email: req.session.email }
        });
        var wallet =  await models.Wallet.findOne({
            where: {user_id: user.id}
        });
        if (wallet == undefined) {
            res.end(JSON.stringify({code: 401, message:"Error : wallet undefined "}));
        }
        let email = req.session.email;
        res.render('economy', {user_email: email, publicKey: wallet.publicKey});
    }
};


exports.addList = async function(req, res) {
    if (req.body ==! null || req.body !== undefined ) {
        var economy =  await models.economy.create({
            PublicKey: req.body.publicKey,
            Product: req.body.product,
            Price: req.body.price,
        });
        res.end(JSON.stringify({message: "Economy block added successfuly !"}));
    }
};



exports.getList = async function(req, res) {
    if (req.body ==! null || req.body !== undefined ) {
        var economy =  await models.economy.findAll();
        res.end(JSON.stringify({economy: economy}));
    }
};


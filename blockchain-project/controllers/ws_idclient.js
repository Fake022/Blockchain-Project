'use strict';

var models = require('../models');
var Sequelize = require('sequelize');

exports.getPublicKey = async function(req) {
    var user = await models.User.findOne({
        where: { email: req.session.email }
    });
    var wallet =  await models.Wallet.findOne({
        where: {user_id: user.id}
    });
    if (wallet == undefined) {
        res.end(JSON.stringify({code: 401, message:"Error : wallet undefined "}));
    }
    const publicKey = wallet.publicKey;
    return publicKey;
};
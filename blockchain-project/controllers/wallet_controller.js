var models = require('../models');
var Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

exports.dashboard_page = function(req, res) {
    let siddu = "Not good";
    let email = req.session.email;
    res.render('index',{user_email: email});
};
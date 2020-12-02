var models = require('../models');
var Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

exports.login_page = function(req, res) {
    res.render('login');
};

exports.login_sign_in = function(req, res) {
    var matched_users_promise = models.User.findAll({
        where: Sequelize.and(
            {email: req.body.email},
        )
    });
    matched_users_promise.then(function(users){ 
        if(users.length > 0){
            let user = users[0];
            let passwordHash = user.password;
            if(bcrypt.compareSync(req.body.password,passwordHash)){
                req.session.email = req.body.email;
                res.redirect('/');
            }
            else{
                res.redirect('/register');
            }
        }
        else{
            res.redirect('/login');
        }
    });
};

exports.register_page = function(req, res) {
    res.render('register',{errors: ""});
};

exports.register_sign_up = function(req, res) {
    var matched_users_promise = models.User.findAll({
        where:  Sequelize.or(
                {username: req.body.username},
                {email: req.body.email}
            )
    });
    matched_users_promise.then(function(users){ 
        if(users.length == 0){
            const passwordHash = bcrypt.hashSync(req.body.password,10);
            models.User.create({
                username: req.body.username,
                email: req.body.email,
                password: passwordHash
            }).then(function(){
                let newSession = req.session;
                newSession.email = req.body.email;
                res.redirect('/');
            });
        }
        else{
            res.render('register',{errors: "Username or Email already in use"});
        }
    })
};
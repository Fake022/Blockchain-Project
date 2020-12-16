var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var path = require('path');
var HomeRoutes = express.Router();

var correct_path = path.join(__dirname+'/../views/home/');
HomeRoutes.get('/',function(req,res){
    let siddu = "Not good";
    let email = req.session.email;
    res.render('home/index',{user_email: email});
});

module.exports = {"HomeRoutes" : HomeRoutes};
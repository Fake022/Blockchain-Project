var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var session = require('express-session');
var AccountRoutes = require('./routes/account');
var HomeRouter = require('./routes/home');

var port = process.env.PORT || 8000;
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'rAnd0mstr!ngs3ssionsecret'}));

//app.use('/', AccountRoutes);
//
//app.use(function(req, res, next) {
//  if( req.session.email == null || req.session.email.length == 0 ){
//    res.redirect('/login'); 
//  }
//    else{
//    next();
//  }
//});

app.use('/', HomeRouter);

app.listen(port);
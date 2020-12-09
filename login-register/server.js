var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var HomeRoutes = require('./controllers/home_controller');
var AccountRoutes = require('./controllers/account_controller');
var MinerRoutes = require('./controllers/miner_controller');

var port = process.env.PORT || 8000;
var app = express();
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({secret: 'rAnd0mstr!ngs3ssionsecret'}));
app.use('/',AccountRoutes.AccountRoutes);
app.use('/',MinerRoutes.MinerRoutes);

app.use(function(req,res,next){
    if(req.session.email == null || req.session.email.length ==0 ){
        res.redirect('/login');
    }
    else{
      next();
    }
});
app.use('/',HomeRoutes.HomeRoutes);

app.listen(port);

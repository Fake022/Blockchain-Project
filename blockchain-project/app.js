var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var fs = require('fs');
var session = require('express-session');
var AccountRoutes = require('./routes/account');
var HomeRouter = require('./routes/home');
var WalletRoutes = require('./routes/wallet');
var NodeRoutes = require('./routes/node');
var MinerRoutes = require('./routes/miner');
var EconomyRoutes = require('./routes/economy');
var app = express();
const expressWs = require('express-ws')(app);
var allUser = [];
var allemail = [];
var port = process.env.PORT || 8000;

const key = fs.readFile('./key-rsa.pem', function(err, data) {
  if (err) {
    console.log(err);
  } else {
    return data;
  }
});
const cert = fs.readFile('./cert.pem', function(err, data) {
  if (err) {
    console.log(err);
  } else {
    return data;
  }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'rAnd0mstr!ngs3ssionsecret'}));




app.use('/', AccountRoutes);

app.use(function(req, res, next) {
    if( req.session.email == null || req.session.email.length == 0 ){
      res.redirect('/login');
    }
      else{
      next();
    }
  });

app.use('/', HomeRouter);
app.use('/', WalletRoutes);
app.use('/', NodeRoutes);
app.use('/', MinerRoutes);
app.use('/', EconomyRoutes);

const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};


function addUserToList(userID) {
  allUser.push(userID);
  allUser = allUser.filter(function (elem, pos)  {
    return allUser.indexOf(elem) == pos;
  });
}

function addEmailToList(email) {
  allemail.push(email);
  allemail = allemail.filter(function (elem, pos)  {
    return allemail.indexOf(elem) == pos;
  });
}

app.ws('/', (ws, req) => {
  var userID = getUniqueID();
  addUserToList(userID);
  console.log('connected: ' + userID);
  addEmailToList(req.session.email);
  console.log('List user : ' + allUser);
  expressWs.getWss().clients.forEach(client => {
    client.send(JSON.stringify({list_user: allUser.length, userID: userID}))
  });

  setInterval(function timeout() {
    ws.pong("heartbeat");
  }, 500);

});

app.ws('/transaction', (ws, req) => {

});


app.listen(port);

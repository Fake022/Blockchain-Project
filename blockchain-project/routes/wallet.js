var express = require('express');
var router = express.Router();
const wallet_controller  = require('../controllers/home_controller');

router.get('/wallet', wallet_controller.wallet_controller);

module.exports = router;

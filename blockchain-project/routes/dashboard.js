var express = require('express');
var router = express.Router();
const dashboard_controller  = require('../controllers/dashboard');

/* GET home page. */

router.get('/users', dashboard_controller.dashboard_page);

module.exports = router;

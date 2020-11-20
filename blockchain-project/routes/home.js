var express = require('express');
var router = express.Router();
const home_controller  = require('../controllers/home_controller');

router.get('/', home_controller.home_controller);

module.exports = router;

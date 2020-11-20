var express = require('express');
var router = express.Router();

const account_controller = require('../controllers/account_controller');

router.get('/login', account_controller.login_page);
router.post('/login', account_controller.login_sign_in);

router.get('/register', account_controller.register_page);
router.post('/register', account_controller.register_sign_up);

module.exports = router;

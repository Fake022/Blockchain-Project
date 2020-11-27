var express = require('express');
var router = express.Router();
const wallet_controller  = require('../controllers/wallet_controller');

router.get('/wallet/generate_keys', wallet_controller.generate_keys);
router.post('/wallet/save_keys', wallet_controller.save_keys);
router.get('/wallet', wallet_controller.wallet_page);

module.exports = router;

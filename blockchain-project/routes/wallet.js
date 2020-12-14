var express = require('express');
var router = express.Router();
const wallet_controller  = require('../controllers/wallet_controller');

router.get('/wallet/generate_keys', wallet_controller.generate_keys);
router.post('/wallet/save_keys', wallet_controller.save_keys);
router.get('/wallet/keys_generator', wallet_controller.wallet_page);

router.get('/wallet/transaction', wallet_controller.wallet_transaction);
router.post('/wallet/transaction/sign', wallet_controller.wallet_sign_transaction);


module.exports = router;
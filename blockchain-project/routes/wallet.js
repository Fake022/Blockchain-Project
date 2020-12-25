var express = require('express');
var router = express.Router();
const wallet_controller  = require('../controllers/wallet_controller');

router.get('/wallet/generate_keys', wallet_controller.generate_keys);
router.post('/wallet/save_keys', wallet_controller.save_keys);
router.get('/wallet/keys_generator', wallet_controller.wallet_page);
router.get('/wallet/getBalance', wallet_controller.wallet_getbalance);
router.get('/wallet/transaction', wallet_controller.wallet_transaction);
router.post('/wallet/transaction/sign', wallet_controller.wallet_sign_transaction);
router.post('/wallet/verifSign', wallet_controller.wallet_verif_sign);
router.post('/wallet/checkbalans', wallet_controller.checkbalans);
router.post('/wallet/checkhash', wallet_controller.checkhash);


module.exports = router;

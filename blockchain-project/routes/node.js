var express = require('express');
var router = express.Router();
const node_controller  = require('../controllers/node_controller');

router.get('/node/network', node_controller.network_page);
router.get('/node/transaction_page', node_controller.new_transaction);
router.post('/node/add_new_transaction', node_controller.add_new_transaction);

router.get('/node/personal_blockchain', node_controller.personal_blockchain);
router.get('/node/mempool_transaction', node_controller.mempool_transaction);

router.post('/node/verify_block', node_controller.verify_block);
router.post('/node/checkbalans', node_controller.checkbalans);
router.post('/node/checkhash', node_controller.checkhash);

module.exports = router;

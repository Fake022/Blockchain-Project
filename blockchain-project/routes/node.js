var express = require('express');
var router = express.Router();
const node_controller  = require('../controllers/node_controller');

router.get('/node/network', node_controller.network_page);
router.get('/node/transaction_page', node_controller.new_transaction);
router.get('/node/personal_blockchain', node_controller.personal_blockchain);
router.get('/node/mempool_transaction', node_controller.mempool_transaction);
router.get('/node/mempool', node_controller.get_personnal_mempool);
router.post('/node/verify_block', node_controller.verify_block);
router.post('/node/add_new_transaction', node_controller.add_new_transaction);
router.post('/node/add_personnal_mempool', node_controller.add_personnal_mempool);
router.post('/node/sendMining', node_controller.sendMining);

module.exports = router;

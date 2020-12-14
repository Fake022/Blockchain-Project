var express = require('express');
var router = express.Router();
const node_controller  = require('../controllers/node_controller');

router.get('/node/network', node_controller.network_page);
router.get('/node/new_transaction', node_controller.new_transaction);
router.get('/node/personnal_blockchain', node_controller.personnal_blockchain);
router.get('/node/mempool_transaction', node_controller.mempool_transaction);

module.exports = router;

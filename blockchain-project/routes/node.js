var express = require('express');
var router = express.Router();
const node_controller  = require('../controllers/node_controller');

router.get('/node/network', node_controller.network_page);


module.exports = router;

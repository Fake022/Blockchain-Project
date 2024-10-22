var express = require('express');
var router = express.Router();
const miner_controller = require('../controllers/miner_controller');

router.get('/miner', miner_controller.miner_page);
router.post('/miner/mine', miner_controller.mine);
router.post('/miner/send', miner_controller.send);


module.exports = router;

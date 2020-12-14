var express = require('express');
var router = express.Router();
const economy_controller  = require('../controllers/economy_controller');

router.get('/economy', economy_controller.page);
router.post('/economy/list', economy_controller.addList);
router.get('/economy/getList', economy_controller.getList);


module.exports = router;

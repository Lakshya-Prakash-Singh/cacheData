const express = require('express');
const cacheController = require('../controllers/cache');
const cacheValidator = require('../validator/cacheValidator');
var router = express.Router();


router.get('/getKeyData/:key', cacheController.getKeyData);
router.get('/getKeyData', cacheController.getKeyData);

router.post('/setKeyData', cacheValidator.keyAndValueValidator, cacheController.setKeyData);

router.put('/updtKeyData', cacheValidator.keyAndValueValidator, cacheController.updtKeyData);

router.delete('/removeKeyData/:key', cacheController.removeKeyData);
router.delete('/removeAllKeyData', cacheController.removeAllKeyData);



module.exports = router;
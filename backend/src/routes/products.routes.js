const router = require('express').Router();
const ctrl = require('../controllers/products.controller');
router.get('/', ctrl.list);
router.get('/:sku', ctrl.getBySku);
module.exports = router;

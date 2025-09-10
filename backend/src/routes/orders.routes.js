const router = require('express').Router();
const ctrl = require('../controllers/orders.controller');
router.post('/', ctrl.create);
module.exports = router;

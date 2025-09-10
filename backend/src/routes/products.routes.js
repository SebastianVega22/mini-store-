import { Router } from 'express';
import * as ctrl from '../controllers/products.controller.js';

const router = Router();

router.get('/', ctrl.list);
router.get('/:sku', ctrl.getBySku);

export default router;
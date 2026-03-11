import { Router } from 'express';

import { getBoss } from '../controllers/castleBossController';

const router = Router();

router.get('/', getBoss);

export default router;
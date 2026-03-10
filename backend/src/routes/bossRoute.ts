import { Router } from 'express';

import { getBoss } from '../controllers/bossController';

const router = Router();

router.get('/', getBoss);

export default router;
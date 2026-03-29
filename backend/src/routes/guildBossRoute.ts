import { Router } from 'express';

import { getBoss } from '../controllers/guildBossController';

const router = Router();

router.get('/', getBoss);

export default router;
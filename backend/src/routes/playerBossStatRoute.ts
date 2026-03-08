import { Router } from 'express';

import { getPlayerBossStat } from '../controllers/playerBossStatController';

const router = Router();

router.get('/:id', getPlayerBossStat);

export default router;
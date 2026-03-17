import { Router } from 'express';

import { createGuildBossSeason, getSeasons } from '../controllers/guildBossSeasonController';

const router = Router();

router.post('/', createGuildBossSeason);
router.get('/', getSeasons);

export default router;
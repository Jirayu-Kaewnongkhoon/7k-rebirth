import { Router } from 'express';

import { createGuildBossSeason, getSeasons, getGuildBoss } from '../controllers/guildBossSeasonController';

const router = Router();

router.post('/', createGuildBossSeason);
router.get('/', getSeasons);
router.get('/boss', getGuildBoss);

export default router;
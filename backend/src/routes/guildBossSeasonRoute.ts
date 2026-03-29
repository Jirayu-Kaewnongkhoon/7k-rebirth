import { Router } from 'express';

import { createGuildBossSeason, getSeasons, getSeason } from '../controllers/guildBossSeasonController';

const router = Router();

router.post('/', createGuildBossSeason);
router.get('/', getSeasons);
router.get('/:id', getSeason);

export default router;
import { Router } from 'express';
import validate from 'express-zod-safe';

import { createGuildBossSeason, getSeasons, getSeason } from '../controllers/guildBossSeasonController';

import { createGuildBossSeasonSchema, getSeasonSchema, getSeasonsSchema } from '../schemas/guildBossSeasonSchema';

const router = Router();

router.post('/', validate({ body: createGuildBossSeasonSchema }), createGuildBossSeason);
router.get('/', validate({ query: getSeasonsSchema }), getSeasons);
router.get('/:id', validate({ params: getSeasonSchema }), getSeason);

export default router;
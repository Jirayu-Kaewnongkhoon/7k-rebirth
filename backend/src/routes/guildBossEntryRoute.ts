import { Router } from 'express';
import validate from 'express-zod-safe';

import { createEntries, getEntries, getEntriesByPlayer, getHitsSummary } from '../controllers/guildBossEntryController';

import { createEntriesSchema, getEntriesByPlayerSchema, getEntriesSchema, getHitsSummarySchema } from '../schemas/guildBossEntrySchema';

const router = Router();

router.get('/', validate({ query: getEntriesSchema }), getEntries);
router.get('/player/:playerId/boss/:bossId', validate({ params: getEntriesByPlayerSchema }), getEntriesByPlayer);
router.get('/hits', validate({ query: getHitsSummarySchema }), getHitsSummary);
router.post('/', validate({ body: createEntriesSchema }), createEntries);

export default router;
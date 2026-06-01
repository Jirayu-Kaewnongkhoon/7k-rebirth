import { Router } from 'express';
import validate from 'express-zod-safe';

import { createEntries, getEntries, getHitsSummary } from '../controllers/guildBossEntryController';

import { createEntriesSchema, getEntriesSchema, getHitsSummarySchema } from '../schemas/guildBossEntrySchema';

const router = Router();

router.get('/', validate({ query: getEntriesSchema }), getEntries);
router.get('/hits', validate({ query: getHitsSummarySchema }), getHitsSummary);
router.post('/', validate({ body: createEntriesSchema }), createEntries);

export default router;
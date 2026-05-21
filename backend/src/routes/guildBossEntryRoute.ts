import { Router } from 'express';
import validate from 'express-zod-safe';

import { createEntries, getEntries } from '../controllers/guildBossEntryController';

import { createEntriesSchema, getEntriesSchema } from '../schemas/guildBossEntrySchema';

const router = Router();

router.get('/', validate({ query: getEntriesSchema }), getEntries);
router.post('/', validate({ body: createEntriesSchema }), createEntries);

export default router;
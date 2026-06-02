import { Router } from 'express';
import validate from 'express-zod-safe';

import {
    createEntries,
    downloadJsonTemplate,
    getEntries,
    getEntriesByPlayer
} from '../controllers/castleEntryController';

import {
    createEntriesSchema,
    downloadTemplateSchema,
    getEntriesSchema,
    getEntriesByPlayerSchema
} from '../schemas/castleEntrySchema';

const router = Router();

router.get('/:leaderboardId', validate({ params: getEntriesSchema }), getEntries);
router.get('/player/:playerId/boss/:bossId', validate({ params: getEntriesByPlayerSchema }), getEntriesByPlayer);
router.post('/', validate({ body: createEntriesSchema }), createEntries);
router.get('/json/:leaderboardId', validate({ params: downloadTemplateSchema }), downloadJsonTemplate);

export default router;
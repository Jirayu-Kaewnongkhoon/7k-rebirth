import { Router } from 'express';
import validate from 'express-zod-safe';

import {
    createEntries,
    downloadJsonTemplate,
    getEntries
} from '../controllers/castleEntryController';

import {
    createEntriesSchema,
    downloadTemplateSchema,
    getEntriesSchema
} from '../schemas/castleEntrySchema';

const router = Router();

router.get('/:leaderboardId', validate({ params: getEntriesSchema }), getEntries);
router.post('/', validate({ body: createEntriesSchema }), createEntries);
router.get('/json/:leaderboardId', validate({ params: downloadTemplateSchema }), downloadJsonTemplate);

export default router;
import { Router } from 'express';

import { createEntries, downloadJsonTemplate, getEntries } from '../controllers/castleEntryController';

const router = Router();

router.get('/:leaderboardId', getEntries);
router.post('/', createEntries);
router.get('/json/:leaderboardId', downloadJsonTemplate);

export default router;
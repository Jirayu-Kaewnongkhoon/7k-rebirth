import { Router } from 'express';

import { createEntries, createEntriesJson, downloadJsonTemplate, getEntries } from '../controllers/castleEntryController';
import { upload } from '../lib/fileUpload';

const router = Router();

router.get('/:leaderboardId', getEntries);
router.post('/', createEntries);
router.get('/json/:leaderboardId', downloadJsonTemplate);
router.post('/json', upload.single('file'), createEntriesJson);

export default router;
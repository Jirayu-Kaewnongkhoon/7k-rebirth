import { Router } from 'express';

import { createEntries, getEntries, createEntriesJson } from '../controllers/entryController';
import { upload } from '../lib/fileUpload';

const router = Router();

router.get('/:leaderboardId', getEntries);
router.post('/', createEntries);
router.post('/json', upload.single('file'), createEntriesJson);

export default router;
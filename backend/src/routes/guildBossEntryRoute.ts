import { Router } from 'express';

import { createEntries, getEntries } from '../controllers/guildBossEntryController';

const router = Router();

router.get('/', getEntries);
router.post('/', createEntries);

export default router;
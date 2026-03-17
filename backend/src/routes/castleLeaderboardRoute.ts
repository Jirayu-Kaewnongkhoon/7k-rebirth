import { Router } from 'express';

import {
    createLeaderboard,
    deleteLeaderboard,
    getLeaderboard,
} from '../controllers/castleLeaderboardController';

const router = Router();

router.get('/:date', getLeaderboard);
router.post('/', createLeaderboard);
router.delete('/:id', deleteLeaderboard);

export default router;
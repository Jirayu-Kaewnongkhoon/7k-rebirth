import { Router } from 'express';

import {
    createLeaderboard,
    deleteLeaderboard,
    getLeaderboard,
    getLeaderboardPageCount,
    getLeaderboards
} from '../controllers/castleLeaderboardController';

const router = Router();

router.get('/', getLeaderboards);
router.get('/count', getLeaderboardPageCount);
router.get('/:date', getLeaderboard);
router.post('/', createLeaderboard);
router.delete('/:id', deleteLeaderboard);

export default router;
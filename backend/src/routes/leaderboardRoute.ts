import { Router } from 'express';

import {
    createLeaderboard,
    deleteLeaderboard,
    getLeaderboardPageCount,
    getLeaderboards
} from '../controllers/leaderboardController';

const router = Router();

router.get('/', getLeaderboards);
router.get('/count', getLeaderboardPageCount);
router.post('/', createLeaderboard);
router.delete('/:id', deleteLeaderboard);

export default router;
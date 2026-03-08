import { Router } from 'express';

import { createLeaderboard, deleteLeaderboard, getLeaderboards } from '../controllers/leaderboardController';

const router = Router();

router.get('/', getLeaderboards);
router.post('/', createLeaderboard);
router.delete('/:id', deleteLeaderboard);

export default router;
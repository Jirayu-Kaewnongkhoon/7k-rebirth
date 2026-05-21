import { Router } from 'express';
import validate from 'express-zod-safe';

import {
    createLeaderboard,
    deleteLeaderboard,
    getLeaderboard,
} from '../controllers/castleLeaderboardController';

import {
    createLeaderboardSchema,
    getLeaderboardSchema,
    deleteLeaderboardSchema
} from '../schemas/castleLeaderboardSchema';

const router = Router();

router.get('/:date', validate({ params: getLeaderboardSchema }), getLeaderboard);
router.post('/', validate({ body: createLeaderboardSchema }), createLeaderboard);
router.delete('/:id', validate({ params: deleteLeaderboardSchema }), deleteLeaderboard);

export default router;
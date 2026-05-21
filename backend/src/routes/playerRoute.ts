import { Router } from 'express';
import validate from 'express-zod-safe';

import { createPlayer, deletePlayer, getPlayer, getPlayers } from '../controllers/playerController';

import { createPlayerSchema, deletePlayerSchema, getPlayerSchema } from '../schemas/playerSchema';

const router = Router();

router.get('/', getPlayers);
router.get('/:id', validate({ params: getPlayerSchema }), getPlayer);
router.post('/', validate({ body: createPlayerSchema }), createPlayer);
router.delete('/:id', validate({ params: deletePlayerSchema }), deletePlayer);

export default router;
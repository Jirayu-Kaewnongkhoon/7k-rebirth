import { Router } from 'express';

import { createPlayer, deletePlayer, getPlayer, getPlayers } from '../controllers/playerController';

const router = Router();

router.get('/', getPlayers);
router.get('/:id', getPlayer);
router.post('/', createPlayer);
router.delete('/:id', deletePlayer);

export default router;
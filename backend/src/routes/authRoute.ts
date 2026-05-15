import { Router } from "express";

import { login, me, logout } from "../controllers/authController";

import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post('/login', login);
router.get('/me', authMiddleware, me);
router.post('/logout', logout);

export default router;
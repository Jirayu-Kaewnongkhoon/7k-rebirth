import { Router } from "express";
import validate from "express-zod-safe";

import { login, me, logout } from "../controllers/authController";

import { authMiddleware } from "../middlewares/auth";

import { loginSchema } from "../schemas/authSchema";

const router = Router();

router.post('/login', validate({ body: loginSchema }), login);
router.get('/me', authMiddleware, me);
router.post('/logout', logout);

export default router;
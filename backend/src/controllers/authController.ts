import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { HttpError } from "../models/errors";
import { BaseResponse } from "../models/response";

import { LoginInput } from "../schemas/authSchema";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 1000 * 60 * 60 * 24 * 7,
};

const login = async (req: LoginInput, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        if (
            username !== process.env.AUTH_USERNAME ||
            !await bcrypt.compare(password, process.env.AUTH_PASSWORD!)
        ) {
            throw new HttpError(401, 'Invalid credentials');
        }

        const token = jwt.sign(
            { username },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, COOKIE_OPTIONS);
        res.json({
            success: true,
            message: 'Logged in successfully',
            data: { username }
        });
    } catch (error) {
        next(error);
    }
};

const me = (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        res.json({
            success: true,
            message: '',
            data: { username: (req as any).user.username }
        });
    } catch (error) {
        next(error);
    }
};

const logout = (_req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        res.clearCookie('token');
        res.json({
            success: true,
            message: 'Logged out successfully',
            data: null
        });
    } catch (error) {
        next(error);
    }
};

export { login, me, logout };
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { HttpError } from "../models/errors";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;

        if (!token) throw new HttpError(401, 'Unauthorized');

        const payload = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = payload;
        next();
    } catch (error) {
        next(error);
    }
};
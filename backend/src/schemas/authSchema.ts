import { ValidatedRequest } from "express-zod-safe";
import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

export type LoginInput = ValidatedRequest<{ body: typeof loginSchema }>;
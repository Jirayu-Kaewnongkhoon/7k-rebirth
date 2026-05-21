import { ValidatedRequest } from "express-zod-safe";
import { z } from "zod";

export const getPlayerSchema = z.object({
    id: z.coerce.number(),
});

export const createPlayerSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

export const deletePlayerSchema = z.object({
    id: z.coerce.number(),
});

export type GetPlayerInput = ValidatedRequest<{ params: typeof getPlayerSchema }>;
export type CreatePlayerInput = ValidatedRequest<{ body: typeof createPlayerSchema }>;
export type DeletePlayerInput = ValidatedRequest<{ params: typeof deletePlayerSchema }>;
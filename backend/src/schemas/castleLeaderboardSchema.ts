import { ValidatedRequest } from "express-zod-safe";
import { z } from "zod";

export const createLeaderboardSchema = z.object({
    date: z.iso.date().transform(val => new Date(val)),
});

export const deleteLeaderboardSchema = z.object({
    id: z.coerce.number(),
});

export const getLeaderboardSchema = z.object({
    date: z.iso.date().transform(val => new Date(val)),
});

export const getLeaderboardsSchema = z.object({
    start: z.iso.date().transform(val => new Date(val)),
    end: z.iso.date().transform(val => new Date(val)),
});

export type CreateLeaderboardInput = ValidatedRequest<{ body: typeof createLeaderboardSchema }>;
export type DeleteLeaderboardInput = ValidatedRequest<{ params: typeof deleteLeaderboardSchema }>;
export type GetLeaderboardInput = ValidatedRequest<{ params: typeof getLeaderboardSchema }>;
export type GetLeaderboardsInput = ValidatedRequest<{ query: typeof getLeaderboardsSchema }>;
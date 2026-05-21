import { ValidatedRequest } from "express-zod-safe";
import { z } from "zod";

const entryDataSchema = z.object({
    playerId: z.number(),
    score: z.number().int().nonnegative(),
    hits: z.number().int().nonnegative(),
});

export const createEntriesSchema = z.object({
    seasonId: z.number(),
    bossId: z.number(),
    entries: z.array(entryDataSchema).min(1),
});

export const getEntriesSchema = z.object({
    seasonId: z.coerce.number(),
    bossId: z.coerce.number(),
});

export type CreateEntriesInput = ValidatedRequest<{ body: typeof createEntriesSchema }>;
export type GetEntriesInput = ValidatedRequest<{ query: typeof getEntriesSchema }>;
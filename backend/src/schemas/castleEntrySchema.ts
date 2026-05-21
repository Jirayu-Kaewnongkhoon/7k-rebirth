import { ValidatedRequest } from "express-zod-safe";
import { z } from "zod";

const entryDataSchema = z.object({
    playerId: z.number(),
    score: z.number().int().nonnegative(),
});

export const createEntriesSchema = z.object({
    leaderboardId: z.number(),
    entries: z.array(entryDataSchema).min(1),
});

export const getEntriesSchema = z.object({
    leaderboardId: z.coerce.number(),
});

export const downloadTemplateSchema = z.object({
    leaderboardId: z.coerce.number(),
});

export type CreateEntriesInput = ValidatedRequest<{ body: typeof createEntriesSchema }>;
export type GetEntriesInput = ValidatedRequest<{ params: typeof getEntriesSchema }>;
export type DownloadTemplateInput = ValidatedRequest<{ params: typeof downloadTemplateSchema }>;
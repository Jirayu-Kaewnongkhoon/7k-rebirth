import { ValidatedRequest } from "express-zod-safe";
import { z } from "zod";

export const createGuildBossSeasonSchema = z.object({
    startDate: z.iso.date().transform(val => new Date(val)),
});

export const getSeasonsSchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
});

export const getSeasonSchema = z.object({
    id: z.coerce.number(),
});

export type CreateGuildBossSeasonInput = ValidatedRequest<{ body: typeof createGuildBossSeasonSchema }>;
export type GetSeasonsInput = ValidatedRequest<{ query: typeof getSeasonsSchema }>;
export type GetSeasonInput = ValidatedRequest<{ params: typeof getSeasonSchema }>;
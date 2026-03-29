import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { BaseResponse } from "../models/response";

import guildBossSeasonService from "../services/guildBossSeasonService";

const createGuildBossSeason = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const { startDate } = req.body;
        await guildBossSeasonService.createGuildBossSeason(startDate);
        res.status(201).json({ success: true, message: 'Season created successfully' });
    } catch (error) {
        next(error);
    }
}

const getSeasonsSchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10)
});
const getSeasons = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const { page, limit } = getSeasonsSchema.parse(req.query);
        const { data, rowCount } = await guildBossSeasonService.getSeasons({ page, limit });
        res.status(200).json({ success: true, data: { seasons: data, rowCount } });
    } catch (error) {
        next(error);
    }
}

const getSeasonSchema = z.object({
    id: z.coerce.number()
});
const getSeason = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const { id } = getSeasonSchema.parse(req.params);
        const result = await guildBossSeasonService.getSeason(id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export { createGuildBossSeason, getSeasons, getSeason };
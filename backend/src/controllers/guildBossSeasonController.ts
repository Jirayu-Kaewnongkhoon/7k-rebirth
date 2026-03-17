import { NextFunction, Request, Response } from "express";

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

const getSeasons = async (_req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const seasons = await guildBossSeasonService.getSeasons();
        res.status(200).json({ success: true, data: seasons });
    } catch (error) {
        next(error);
    }
}

export { createGuildBossSeason, getSeasons };
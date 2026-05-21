import { NextFunction, Response } from "express";

import { BaseResponse } from "../models/response";

import guildBossSeasonService from "../services/guildBossSeasonService";

import { CreateGuildBossSeasonInput, GetSeasonInput, GetSeasonsInput } from "../schemas/guildBossSeasonSchema";

const createGuildBossSeason = async (req: CreateGuildBossSeasonInput, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const { startDate } = req.body;
        await guildBossSeasonService.createGuildBossSeason(startDate);
        res.status(201).json({ success: true, message: 'Season created successfully' });
    } catch (error) {
        next(error);
    }
}

const getSeasons = async (req: GetSeasonsInput, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const { page, limit } = req.query;
        const { data, rowCount } = await guildBossSeasonService.getSeasons({ page, limit });
        res.status(200).json({ success: true, data: { seasons: data, rowCount } });
    } catch (error) {
        next(error);
    }
}

const getSeason = async (req: GetSeasonInput, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await guildBossSeasonService.getSeason(id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export { createGuildBossSeason, getSeasons, getSeason };
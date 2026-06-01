import { NextFunction, Response } from "express";

import { BaseResponse } from "../models/response";

import guildBossEntryService from "../services/guildBossEntryService";

import { CreateEntriesInput, GetEntriesInput, GetHitsSummaryInput } from "../schemas/guildBossEntrySchema";

const createEntries = async (req: CreateEntriesInput, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const data = req.body;
        await guildBossEntryService.createEntries(data);
        res.status(201).json({ success: true, message: 'Entries created successfully' });
    } catch (error) {
        next(error);
    }
}

const getEntries = async (req: GetEntriesInput, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const { seasonId, bossId } = req.query;
        const entries = await guildBossEntryService.getEntries({ seasonId, bossId });
        res.status(200).json({ success: true, data: entries });
    } catch (error) {
        next(error);
    }
}

const getHitsSummary = async (req: GetHitsSummaryInput, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const { seasonId } = req.query;
        const summary = await guildBossEntryService.getHitsSummary(seasonId);
        res.status(200).json({ success: true, data: summary });
    } catch (error) {
        next(error);
    }
}

export { createEntries, getEntries, getHitsSummary };
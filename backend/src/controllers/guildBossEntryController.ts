import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { BaseResponse } from "../models/response";

import guildBossEntryService from "../services/guildBossEntryService";

const createEntries = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const data = req.body;
        await guildBossEntryService.createEntries(data);
        res.status(201).json({ success: true, message: 'Entries created successfully' });
    } catch (error) {
        next(error);
    }
}

const getEntriesSchema = z.object({
    seasonId: z.coerce.number(),
    bossId: z.coerce.number()
});
const getEntries = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const { seasonId, bossId } = getEntriesSchema.parse(req.query);
        const entries = await guildBossEntryService.getEntries({ seasonId, bossId });
        res.status(200).json({ success: true, data: entries });
    } catch (error) {
        next(error);
    }
}

const createEntriesJson = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        if (!req.file) throw new Error('No file uploaded');

        const data = JSON.parse(req.file.buffer.toString());
        console.log(data);

        await guildBossEntryService.createEntries(data);
        res.status(201).json({ success: true, message: 'Entries created successfully' });

    } catch (error) {
        next(error);
    }
}

export { createEntries, getEntries, createEntriesJson };
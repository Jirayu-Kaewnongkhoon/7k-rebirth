import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { BaseResponse } from "../models/response";

import castleEntryService from "../services/castleEntryService";

const createEntries = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const data = req.body;
        await castleEntryService.createEntries(data);
        res.status(201).json({ success: true, message: 'Entries created successfully' });
    } catch (error) {
        next(error);
    }
}

const getEntries = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const leaderboardId = Number(req.params.leaderboardId);
        const entries = await castleEntryService.getEntries(leaderboardId);
        res.status(200).json({ success: true, data: entries });
    } catch (error) {
        next(error);
    }
}

const createEntriesJson = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        if (!req.file) throw new Error('No file uploaded');

        const data = JSON.parse(req.file.buffer.toString());

        await castleEntryService.createEntries(data);
        res.status(201).json({ success: true, message: 'Entries created successfully' });

    } catch (error) {
        next(error);
    }
}

const downloadTemplateSchema = z.object({
    leaderboardId: z.coerce.number()
});
const downloadJsonTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { leaderboardId } = downloadTemplateSchema.parse(req.params);

        const template = await castleEntryService.getJsonTemplate(leaderboardId);

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", "attachment; filename=template.json");
        res.json(template);
    } catch (error) {
        next(error);
    }
}

export { createEntries, getEntries, createEntriesJson, downloadJsonTemplate };
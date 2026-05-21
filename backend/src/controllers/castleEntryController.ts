import { NextFunction, Response } from "express";

import { BaseResponse } from "../models/response";

import castleEntryService from "../services/castleEntryService";

import { CreateEntriesInput, DownloadTemplateInput, GetEntriesInput } from "../schemas/castleEntrySchema";

const createEntries = async (req: CreateEntriesInput, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const data = req.body;
        await castleEntryService.createEntries(data);
        res.status(201).json({ success: true, message: 'Entries created successfully' });
    } catch (error) {
        next(error);
    }
}

const getEntries = async (req: GetEntriesInput, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const leaderboardId = req.params.leaderboardId;
        const entries = await castleEntryService.getEntries(leaderboardId);
        res.status(200).json({ success: true, data: entries });
    } catch (error) {
        next(error);
    }
}

const downloadJsonTemplate = async (req: DownloadTemplateInput, res: Response, next: NextFunction) => {
    try {
        const leaderboardId = req.params.leaderboardId;

        const template = await castleEntryService.getJsonTemplate(leaderboardId);

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", "attachment; filename=template.json");
        res.json(template);
    } catch (error) {
        next(error);
    }
}

export { createEntries, downloadJsonTemplate, getEntries };
import { NextFunction, Request, Response } from "express";

import { BaseResponse } from "../models/response";

import entryService from "../services/entryService";

const createEntries = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const data = req.body;
        await entryService.createEntries(data);
        res.status(201).json({ success: true, message: 'Entries created successfully' });
    } catch (error) {
        next(error);
    }
}

const getEntries = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const leaderboardId = Number(req.params.leaderboardId);
        const entries = await entryService.getEntries(leaderboardId);
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
        
        await entryService.createEntries(data);
        res.status(201).json({ success: true, message: 'Entries created successfully' });

    } catch (error) {
        next(error);
    }
}

export { createEntries, getEntries, createEntriesJson };
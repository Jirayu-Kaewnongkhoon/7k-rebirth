import { NextFunction, Request, Response } from "express";

import leaderboardService from '../services/leaderboardService';
import { BaseResponse } from "../models/response";

const createLeaderboard = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const data = req.body;
        await leaderboardService.createLeaderboard(data);
        res.status(201).json({ message: 'Leaderboard created successfully', success: true });
    } catch (error) {
        next(error);
    }
}

const deleteLeaderboard = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const leaderboardId = Number(req.params.id);
        await leaderboardService.deleteLeaderboard(leaderboardId);
        res.status(200).json({ message: 'Leaderboard deleted successfully', success: true });
    } catch (error) {
        next(error);
    }
}

const getLeaderboards = async (_req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const result = await leaderboardService.getLeaderboards();
        res.status(200).json({ data: result, success: true });
    } catch (error) {
        next(error);
    }
}

export { createLeaderboard, deleteLeaderboard, getLeaderboards };
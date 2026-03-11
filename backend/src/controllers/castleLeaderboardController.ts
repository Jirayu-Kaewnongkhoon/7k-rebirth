import { NextFunction, Request, Response } from "express";

import castleLeaderboardService from '../services/castleLeaderboardService';

import { BaseResponse } from "../models/response";

const createLeaderboard = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const { date } = req.body;
        await castleLeaderboardService.createLeaderboard(date);
        res.status(201).json({ message: 'Leaderboard created successfully', success: true });
    } catch (error) {
        next(error);
    }
}

const deleteLeaderboard = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const leaderboardId = Number(req.params.id);
        await castleLeaderboardService.deleteLeaderboard(leaderboardId);
        res.status(200).json({ message: 'Leaderboard deleted successfully', success: true });
    } catch (error) {
        next(error);
    }
}

const getLeaderboard = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const date = new Date(req.params.date);
        const result = await castleLeaderboardService.getLeaderboard(date);
        res.status(200).json({ data: result, success: true });
    } catch (error) {
        next(error);
    }
}

const getLeaderboards = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const page = req.query.page;
        const result = await castleLeaderboardService.getLeaderboards(Number(page));
        res.status(200).json({ data: result, success: true });
    } catch (error) {
        next(error);
    }
}

const getLeaderboardPageCount = async (_req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const result = await castleLeaderboardService.getLeaderboardPageCount();
        res.status(200).json({ data: result, success: true });
    } catch (error) {
        next(error);
    }
}

export {
    createLeaderboard,
    deleteLeaderboard,
    getLeaderboard,
    getLeaderboards,
    getLeaderboardPageCount
};
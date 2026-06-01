import { NextFunction, Response } from "express";

import castleLeaderboardService from '../services/castleLeaderboardService';

import { BaseResponse } from "../models/response";

import { CreateLeaderboardInput, DeleteLeaderboardInput, GetLeaderboardInput, GetLeaderboardsInput } from "../schemas/castleLeaderboardSchema";

const createLeaderboard = async (req: CreateLeaderboardInput, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const { date } = req.body;
        await castleLeaderboardService.createLeaderboard(date);
        res.status(201).json({ message: 'Leaderboard created successfully', success: true });
    } catch (error) {
        next(error);
    }
}

const deleteLeaderboard = async (req: DeleteLeaderboardInput, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const leaderboardId = req.params.id;
        await castleLeaderboardService.deleteLeaderboard(leaderboardId);
        res.status(200).json({ message: 'Leaderboard deleted successfully', success: true });
    } catch (error) {
        next(error);
    }
}

const getLeaderboard = async (req: GetLeaderboardInput, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const date = req.params.date;
        const result = await castleLeaderboardService.getLeaderboard(date);
        res.status(200).json({ data: result, success: true });
    } catch (error) {
        next(error);
    }
}

const getLeaderboards = async (req: GetLeaderboardsInput, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const { start, end } = req.query;
        const result = await castleLeaderboardService.getLeaderboards(start, end);
        res.status(200).json({ data: result, success: true });
    } catch (error) {
        next(error);
    }
}

export {
    createLeaderboard,
    deleteLeaderboard,
    getLeaderboard,
    getLeaderboards
};
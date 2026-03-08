import { NextFunction, Request, Response } from "express";

import { BaseResponse } from "../models/response";

import playerService from "../services/playerService";

const createPlayer = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const playerName = req.body.name;
        await playerService.createPlayer(playerName);
        res.status(201).json({ success: true, message: 'PLayer created successfully' });
    } catch (error) {
        next(error);
    }
}

const getPlayer = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const playerId = Number(req.params.id);
        const player = await playerService.getPlayer(playerId);
        res.status(200).json({ success: true, data: player });
    } catch (error) {
        next(error);
    }
}

const getPlayers = async (_req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const players = await playerService.getPlayers();
        res.status(200).json({ success: true, data: players });
    } catch (error) {
        next(error);
    }
}

const deletePlayer = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const playerId = Number(req.params.id);
        await playerService.deletePlayer(playerId);
        res.status(201).json({ success: true, message: 'Player deleted successfully' });
    } catch (error) {
        next(error);
    }
}

export { createPlayer, getPlayer, getPlayers, deletePlayer };
import { NextFunction, Request, Response } from "express";

import { BaseResponse } from "../models/response";

import playerService from "../services/playerBossStatService";

const getPlayerBossStat = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const playerId = Number(req.params.id);
        const stat = await playerService.getPlayerBossStat(playerId);
        res.status(200).json({ success: true, data: stat });
    } catch (error) {
        next(error);
    }
}

export { getPlayerBossStat };
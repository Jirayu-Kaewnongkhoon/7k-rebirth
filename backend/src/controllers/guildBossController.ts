import { NextFunction, Request, Response } from "express";

import { BaseResponse } from "../models/response";

import guildBossService from "../services/guildBossService";

const getBoss = async (_req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const boss = await guildBossService.getBoss();
        res.status(200).json({ success: true, data: boss });
    } catch (error) {
        next(error);
    }
}

export { getBoss };
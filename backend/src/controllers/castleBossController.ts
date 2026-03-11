import { NextFunction, Request, Response } from "express";

import { BaseResponse } from "../models/response";

import castleBossService from "../services/castleBossService";

const getBoss = async (_req: Request, res: Response<BaseResponse>, next: NextFunction) => {
    try {
        const boss = await castleBossService.getBoss();
        res.status(200).json({ success: true, data: boss });
    } catch (error) {
        next(error);
    }
}

export { getBoss };
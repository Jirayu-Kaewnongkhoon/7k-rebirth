import { Request, Response, NextFunction } from "express";

import { HttpError } from "../models/errors";
import { BaseResponse } from "../models/response";

function parseError(error: unknown): { statusCode: number; message: string } {
    if (error instanceof HttpError) {
        return {
            statusCode: error.statusCode,
            message: error.message
        };
    }
    if (error instanceof Error) {
        return {
            statusCode: 500,
            message: error.message
        };
    }
    return {
        statusCode: 500,
        message: `An unknown error occurred, ${String(error)}`
    };
}

export function globalErrorHandler(
    error: unknown,
    _request: Request,
    response: Response<BaseResponse>,
    _next: NextFunction
) {
    const { statusCode, message } = parseError(error);

    console.error(error instanceof Error ? `${error.name}: ${error.message}` : 'Unknown error');

    response.status(statusCode).send({
        message,
        success: false,
        data: null,
        traceStack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
    });
}
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../models/errors";
import { BaseResponse } from "../models/response";

export function globalErrorHandler(
    error: unknown,
    request: Request,
    response: Response<BaseResponse>,
    next: NextFunction
) {
    let statusCode = 500;
    let message = '';

    if (error instanceof HttpError) {
        statusCode = error.statusCode;
    }

    if (error instanceof Error) {
        console.error(`${error.name}: ${error.message}`);
        message = error.message;
    } else {
        console.error('Unknown error');
        message = `An unknown error occurred, ${String(error)}`;
    }

    response.status(statusCode).send({
        message,
        success: false,
        data: null,
        traceStack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
    });
}
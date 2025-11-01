import type { Request, Response, NextFunction } from "express";
import { AppError } from "../interfaces/AppError.js";

export function errorMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  res.status(status).json({
    error: true,
    message: err.message,
    details: err.details || {},
    status,
  });
}

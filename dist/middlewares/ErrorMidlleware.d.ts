import type { Request, Response, NextFunction } from "express";
import { AppError } from "../interfaces/AppError.js";
export declare function errorMiddleware(err: AppError, req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=ErrorMidlleware.d.ts.map
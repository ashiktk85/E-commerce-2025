import { AppError } from "../interfaces/AppError.js";
export function errorMiddleware(err, req, res, next) {
    const status = err.status || 500;
    res.status(status).json({
        error: true,
        message: err.message,
        details: err.details || {},
        status,
    });
}
//# sourceMappingURL=ErrorMidlleware.js.map
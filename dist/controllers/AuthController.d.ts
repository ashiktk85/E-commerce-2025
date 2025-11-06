import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService.js";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    verifyOTP(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    resendOTP(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    login(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    refreshToken(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    logout(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=AuthController.d.ts.map
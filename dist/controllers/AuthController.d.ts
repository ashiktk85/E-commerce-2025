import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService.js";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map
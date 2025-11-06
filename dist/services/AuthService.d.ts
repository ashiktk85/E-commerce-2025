import type { UserRepository } from "../repositories/UserRepository.js";
import type { IUser } from "../models/User.js";
export declare class AuthService {
    private userRepo;
    constructor(userRepo: UserRepository);
    register(firstName: string, lastName: string, email: string, password: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyOTP(email: string, otp: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resendOTP(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    login(email: string, password: string): Promise<{
        user: IUser;
        token: string;
    }>;
    refreshToken(accessToken: string, refreshToken: string): Promise<{
        user: IUser;
        token: string;
    }>;
}
//# sourceMappingURL=AuthService.d.ts.map
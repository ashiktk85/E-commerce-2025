import type { UserRepository } from "../repositories/UserRepository.js";
export declare class AuthService {
    private userRepo;
    constructor(userRepo: UserRepository);
    register(name: string, email: string, password: string): Promise<{
        success: boolean;
        message: string;
    }>;
    login(email: string, password: string): Promise<{
        user: import("../models/User.js").IUser;
        token: string;
    }>;
}
//# sourceMappingURL=AuthService.d.ts.map
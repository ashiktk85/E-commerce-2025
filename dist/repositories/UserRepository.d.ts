import type { IUser } from "../models/User.js";
export declare class UserRepository {
    createUser(userData: Partial<IUser>): Promise<void>;
    findByEmail(email: string): Promise<IUser | null>;
}
//# sourceMappingURL=UserRepository.d.ts.map
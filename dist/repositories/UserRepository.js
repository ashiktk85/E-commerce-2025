import User from "../models/User.js";
export class UserRepository {
    async createUser(userData) {
        var _a;
        try {
            const user = new User(userData);
            await user.save();
        }
        catch (e) {
            if (e && e.code === 11000 && ((_a = e.keyPattern) === null || _a === void 0 ? void 0 : _a.email)) {
                throw new Error("Email already in use");
            }
            throw e;
        }
    }
    async findByEmail(email) {
        return await User.findOne({ email: email.toLowerCase() }).select("-password");
    }
}
//# sourceMappingURL=UserRepository.js.map
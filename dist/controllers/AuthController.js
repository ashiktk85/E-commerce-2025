import { AuthService } from "../services/AuthService.js";
import { AppError } from "../interfaces/AppError.js";
export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(req, res, next) {
        try {
            const { firstName, lastName, email, password } = req.body;
            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({ message: "All fields required" });
            }
            console.log(req.body, "bodyy");
            const result = await this.authService.register(firstName, lastName, email, password);
            return res.json(result);
        }
        catch (err) {
            return next(new AppError(err.message, 400));
        }
    }
    async verifyOTP(req, res, next) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).json({ message: "All fields required" });
            }
            const result = await this.authService.verifyOTP(email, otp);
            return res.json(result);
        }
        catch (err) {
            return next(new AppError(err.message, 400));
        }
    }
    async resendOTP(req, res, next) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email required" });
            }
            await this.authService.resendOTP(email);
            return res.json({ message: "OTP resent successfully" });
        }
        catch (err) {
            return next(new AppError(err.message, 400));
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "All fields required" });
            }
            const result = await this.authService.login(email, password);
            res.cookie("accessToken", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 15 * 60 * 1000,
                sameSite: "strict"
            });
            res.cookie("refreshToken", result.user.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: "strict"
            });
            return res.json({ message: "Login successful", user: result.user });
        }
        catch (err) {
            return next(new AppError(err.message, 400));
        }
    }
    async refreshToken(req, res, next) {
        try {
            const accessToken = req.cookies.accessToken;
            const refreshToken = req.cookies.refreshToken;
            if (!accessToken || !refreshToken) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const result = await this.authService.refreshToken(accessToken, refreshToken);
            res.cookie("accessToken", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 15 * 60 * 1000,
                sameSite: "strict"
            });
            return res.json({ message: "Token refreshed successfully", user: result.user });
        }
        catch (err) {
            return next(new AppError(err.message, 500));
        }
    }
    async logout(req, res, next) {
        try {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.json({ message: "Logout successful" });
        }
        catch (err) {
            return next(new AppError(err.message, 500));
        }
    }
}
//# sourceMappingURL=AuthController.js.map
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { validateRegistrationInput } from "../config/loginValidation.js";
import { generateOTP } from "../config/otp.js";
import { sendOTPEmail } from "../utils/mailer.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwtAuth.js";
export class AuthService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async register(firstName, lastName, email, password) {
        const validationResult = validateRegistrationInput(email, password);
        if (!validationResult.valid) {
            throw new Error(validationResult.message || "Invalid input");
        }
        const existingUser = await this.userRepo.findByEmail(email);
        if (existingUser) {
            throw new Error("Email already in use");
        }
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 500);
        await this.userRepo.createUser({
            firstName,
            lastName,
            email,
            password: password,
            provider: "local",
            verified: false,
            otp,
            otpExpiry,
        });
        await sendOTPEmail(email, otp);
        return {
            success: true,
            message: "Registration successful! Please verify your email/OTP to activate your account.",
        };
    }
    async verifyOTP(email, otp) {
        const user = await this.userRepo.findByEmail(email);
        if (!user || !user._id) {
            throw new Error("User not found");
        }
        if (user.verified) {
            throw new Error("User already verified");
        }
        if (!user.otp || user.otp !== otp) {
            throw new Error("Invalid OTP");
        }
        if (!user.otpExpiry || user.otpExpiry <= new Date()) {
            throw new Error("OTP expired");
        }
        user.verified = true;
        user.otp = "";
        user.otpExpiry = new Date();
        await this.userRepo.updateUser(user._id.toString(), {
            verified: true,
            otp: "",
            otpExpiry: new Date(),
        });
        return { success: true, message: "OTP verified successfully" };
    }
    async resendOTP(email) {
        const user = await this.userRepo.findById(email);
        if (!user || !user._id) {
            throw new Error("User not found");
        }
        if (user.verified) {
            throw new Error("User already verified");
        }
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await this.userRepo.updateUser(user._id.toString(), {
            otp: newOtp,
            otpExpiry,
        });
        await sendOTPEmail(email, newOtp);
        return { success: true, message: "OTP resent successfully" };
    }
    async login(email, password) {
        const user = await this.userRepo.findByEmail(email);
        if (!user || !user._id) {
            throw new Error("User not found");
        }
        if (!user.verified) {
            throw new Error("User not verified");
        }
        if (!user.password || !(await bcrypt.compare(password, user.password))) {
            throw new Error("Invalid credentials");
        }
        const token = generateAccessToken({ id: user._id.toString(), role: "user" });
        const refreshToken = generateRefreshToken({ id: user._id.toString(), role: "user" });
        await this.userRepo.updateUser(user._id.toString(), { refreshToken: refreshToken });
        return { user, token: token };
    }
    async refreshToken(accessToken, refreshToken) {
        const decoded = verifyRefreshToken(accessToken);
        const decodedRefreshToken = verifyRefreshToken(refreshToken);
        if (!decoded || !decodedRefreshToken) {
            throw new Error("Invalid token");
        }
        if (decoded !== decodedRefreshToken) {
            throw new Error("Invalid token");
        }
        const user = await this.userRepo.findById(decoded);
        if (!user || !user._id) {
            throw new Error("User not found");
        }
        const token = generateAccessToken({ id: user._id.toString(), role: "user" });
        return { user, token: token };
    }
}
//# sourceMappingURL=AuthService.js.map
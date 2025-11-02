import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import type { UserRepository } from "../repositories/UserRepository.js";
import { validateRegistrationInput } from "../config/loginValidation.js";
import { generateOTP } from "../config/otp.js";
import { sendOTPEmail } from "../utils/mailer.js";
import type { IUser } from "../models/User.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwtValidation.js";

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async register(name: string, email: string, password: string) {
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
      name,
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
      message:
        "Registration successful! Please verify your email/OTP to activate your account.",
    };
  }

  async verifyOTP(email: string, otp: string) {
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
    } as Partial<IUser>);
    return { success: true, message: "OTP verified successfully" };
  }

  async resendOTP(email: string) {
    const user = await this.userRepo.findById(email);
    if (!user || !user._id) {
      throw new Error("User not found");
    }
    if (user.verified) {
      throw new Error("User already verified");
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await this.userRepo.updateUser(user._id.toString() as string, {
      otp: newOtp,
      otpExpiry,
    });

    await sendOTPEmail(email, newOtp);

    return { success: true, message: "OTP resent successfully" };
  }

  async login(email: string, password: string) {
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
    const token = generateAccessToken({ id: user._id.toString() as string ,role: "user" });
    const refreshToken = generateRefreshToken({ id: user._id.toString() as string ,role: "user" });
    await this.userRepo.updateUser(user._id.toString() as string, { refreshToken: refreshToken });
    return { user, token: token };
  } 

  async refreshToken(accessToken: string, refreshToken: string) {
    const decoded = verifyRefreshToken(accessToken);
    const decodedRefreshToken = verifyRefreshToken(refreshToken);
    if (!decoded || !decodedRefreshToken) {
      throw new Error("Invalid token");
    }
    if (decoded !== decodedRefreshToken) {
      throw new Error("Invalid token");
    }
    const user = await this.userRepo.findById(decoded as string);
    if (!user || !user._id) {
      throw new Error("User not found"); 
    }
    const token = generateAccessToken({ id: user._id.toString() as string ,role: "user" });
    return { user, token: token };
  }
}

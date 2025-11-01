import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import type { UserRepository } from "../repositories/UserRepository.js";
import { validateRegistrationInput } from "../config/loginValidation.js";
import { generateOTP } from "../config/otp.js";

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

    return {
      success: true,
      message: "Registration successful! Please verify your email/OTP to activate your account."
    }     
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET!);
      return { user, token };
    }
    throw new Error("Invalid credentials");
  }
}
  
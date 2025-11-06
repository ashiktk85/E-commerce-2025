import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService.js";
import { AppError } from "../interfaces/AppError.js";
import type { IUser } from "../models/User.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, password } = req.body;
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
      }
      console.log(req.body, "bodyy");
      
      const result = await this.authService.register(firstName,lastName, email, password);
      return res.json(result);
    } catch (err: any) {
      return next(new AppError(err.message, 400)); 
    }
  }

  async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ message: "All fields required" });
      }
      const result = await this.authService.verifyOTP(email, otp);
      return res.json(result);
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }   

  async resendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email required" });
      }
      await this.authService.resendOTP(email);
      return res.json({ message: "OTP resent successfully" });
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
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
  
      res.cookie("refreshToken", result.user.refreshToken as string, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "strict"
      });
  
      return res.json({ message: "Login successful", user: result.user as IUser });
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
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
      return res.json({ message: "Token refreshed successfully", user: result.user as IUser });
    } catch (err: any) {
      return next(new AppError(err.message, 500));
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.json({ message: "Logout successful" });
    } catch (err: any) {
      return next(new AppError(err.message, 500));
    }
  }
}

import { Router } from "express";
import { UserRepository } from "../repositories/UserRepository.js";
import { AuthService } from "../services/AuthService.js";
import { AuthController } from "../controllers/AuthController.js";
const router = Router();
// DI setup
const userRepo = new UserRepository();
const authService = new AuthService(userRepo);
const authController = new AuthController(authService);
// Local Auth
router.post("/register", (req, res, next) => authController.register(req, res, next));
router.post("/verify-otp", (req, res, next) => authController.verifyOTP(req, res, next));
router.post('/resend-otp', (req, res, next) => authController.resendOTP(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/refresh-token', (req, res, next) => authController.refreshToken(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res, next));
export default router;
//# sourceMappingURL=auth.js.map
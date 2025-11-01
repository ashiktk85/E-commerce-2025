import { Router } from "express";
import * as passport from "passport";
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
router.post("/login", (req, res, next) => authController.login(req, res, next));
export default router;
//# sourceMappingURL=auth.js.map
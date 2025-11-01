import { AuthService } from "../services/AuthService.js";
import { AppError } from "../interfaces/AppError.js";
export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ message: "All fields required" });
            }
            const result = await this.authService.register(name, email, password);
            res.json(result);
        }
        catch (err) {
            next(new AppError(err.message, 400));
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.json(result);
        }
        catch (err) {
            next(new AppError("Invalid credentials", 401));
        }
    }
}
//# sourceMappingURL=AuthController.js.map
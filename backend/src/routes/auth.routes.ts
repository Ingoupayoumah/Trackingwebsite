import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { loginLimiter } from "../middleware/rateLimit";

export const authRouter = Router();

authRouter.post("/login", loginLimiter, login);

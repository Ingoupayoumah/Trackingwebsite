import { Router } from "express";
import { getSuivi, verifierSuivi } from "../controllers/tracking.controller";
import { trackingVerifyLimiter } from "../middleware/rateLimit";

export const trackingRouter = Router();

trackingRouter.post("/:trackingCode/verifier", trackingVerifyLimiter, verifierSuivi);
trackingRouter.get("/:trackingCode", getSuivi);

import "express-async-errors";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { adminRouter } from "./routes/admin.routes";
import { authRouter } from "./routes/auth.routes";
import { commandeRouter } from "./routes/commande.routes";
import { trackingRouter } from "./routes/tracking.routes";

export const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/commandes", commandeRouter);
app.use("/suivi", trackingRouter);

app.use(errorHandler);

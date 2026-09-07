import { Router } from "express";
import {
  addTrackingEvent,
  createCommande,
  listCommandes,
} from "../controllers/commande.controller";
import { requireAuth } from "../middleware/auth";

export const commandeRouter = Router();

commandeRouter.use(requireAuth("admin", "entreprise"));

commandeRouter.post("/", createCommande);
commandeRouter.get("/", listCommandes);
commandeRouter.post("/:commandeId/evenements", addTrackingEvent);

import { Router } from "express";
import {
  createEntreprise,
  listEntreprises,
  updateEntrepriseStatut,
} from "../controllers/admin.controller";
import { requireAuth } from "../middleware/auth";

export const adminRouter = Router();

adminRouter.use(requireAuth("admin"));

adminRouter.post("/entreprises", createEntreprise);
adminRouter.get("/entreprises", listEntreprises);
adminRouter.patch("/entreprises/:id/statut", updateEntrepriseStatut);

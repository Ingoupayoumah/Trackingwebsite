import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { HttpError } from "../middleware/errorHandler";
import { signAuthToken } from "../utils/jwt";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
    const token = signAuthToken({ sub: admin.id, role: "admin" });
    return res.json({ token, role: "admin", id: admin.id });
  }

  const entreprise = await prisma.entreprise.findUnique({ where: { email } });
  if (entreprise && (await bcrypt.compare(password, entreprise.passwordHash))) {
    if (entreprise.statut === "SUSPENDU") {
      throw new HttpError(403, "Ce compte entreprise est suspendu");
    }
    const token = signAuthToken({ sub: entreprise.id, role: "entreprise" });
    return res.json({ token, role: "entreprise", id: entreprise.id, nom: entreprise.nom });
  }

  throw new HttpError(401, "Email ou mot de passe incorrect");
}

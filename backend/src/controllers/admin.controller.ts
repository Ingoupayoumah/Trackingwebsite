import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { HttpError } from "../middleware/errorHandler";

const createEntrepriseSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  nom: z.string().min(1),
  adresse: z.string().optional(),
  telephone: z.string().optional(),
});

export async function createEntreprise(req: Request, res: Response) {
  const data = createEntrepriseSchema.parse(req.body);
  const adminId = req.auth!.sub;

  const existing = await prisma.entreprise.findUnique({ where: { email: data.email } });
  if (existing) throw new HttpError(409, "Un compte existe déjà avec cet email");

  const passwordHash = await bcrypt.hash(data.password, 12);

  const entreprise = await prisma.entreprise.create({
    data: {
      email: data.email,
      passwordHash,
      nom: data.nom,
      adresse: data.adresse,
      telephone: data.telephone,
      creeParAdminId: adminId,
    },
    select: { id: true, email: true, nom: true, statut: true, createdAt: true },
  });

  res.status(201).json(entreprise);
}

export async function listEntreprises(_req: Request, res: Response) {
  const entreprises = await prisma.entreprise.findMany({
    select: { id: true, email: true, nom: true, statut: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(entreprises);
}

const updateStatutSchema = z.object({
  statut: z.enum(["ACTIF", "SUSPENDU"]),
});

export async function updateEntrepriseStatut(req: Request, res: Response) {
  const { statut } = updateStatutSchema.parse(req.body);
  const entreprise = await prisma.entreprise.update({
    where: { id: req.params.id },
    data: { statut },
    select: { id: true, statut: true },
  });
  res.json(entreprise);
}

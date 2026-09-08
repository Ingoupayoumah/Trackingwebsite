import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { HttpError } from "../middleware/errorHandler";
import { signClientSession, verifyClientSession } from "../utils/jwt";

const SESSION_COOKIE = "tracking_session";

const verifySchema = z.object({
  email: z.string().email(),
});

async function findCommandeByCode(trackingCode: string) {
  const commande = await prisma.commande.findUnique({
    where: { trackingCode },
    include: { evenements: { orderBy: { createdAt: "asc" } }, entreprise: { select: { nom: true } } },
  });
  if (!commande) throw new HttpError(404, "Code ou email invalide");
  return commande;
}

function serialize(commande: Awaited<ReturnType<typeof findCommandeByCode>>) {
  return {
    trackingCode: commande.trackingCode,
    entrepriseNom: commande.entreprise.nom,
    statutActuel: commande.statutActuel,
    pointDepart: commande.pointDepart,
    pointDepartLat: commande.pointDepartLat,
    pointDepartLng: commande.pointDepartLng,
    pointLivraison: commande.pointLivraison,
    pointLivraisonLat: commande.pointLivraisonLat,
    pointLivraisonLng: commande.pointLivraisonLng,
    description: commande.description,
    delaiEstime: commande.delaiEstime,
    createdAt: commande.createdAt,
    evenements: commande.evenements.map((e) => ({
      statut: e.statut,
      message: e.message,
      localisation: e.localisation,
      latitude: e.latitude,
      longitude: e.longitude,
      createdAt: e.createdAt,
    })),
  };
}

function setSessionCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    // En prod, frontend et backend vivent sur des domaines Vercel différents :
    // il faut "none" (+ secure) pour que le cookie soit envoyé cross-site.
    // En local (http://localhost), "none" exigerait quand même secure=true, que
    // les navigateurs refusent sans HTTPS — on reste donc sur "lax" en dev.
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: 6 * 60 * 60 * 1000,
  });
}

// POST /suivi/:trackingCode/verifier — le client confirme son email pour accéder au suivi.
export async function verifierSuivi(req: Request, res: Response) {
  const { email } = verifySchema.parse(req.body);
  const commande = await findCommandeByCode(req.params.trackingCode);

  if (commande.clientEmail.toLowerCase() !== email.toLowerCase()) {
    // Message volontairement générique : ne pas révéler si c'est l'email ou le code qui est faux.
    throw new HttpError(401, "Code ou email invalide");
  }

  setSessionCookie(res, signClientSession({ commandeId: commande.id }));
  res.json(serialize(commande));
}

// GET /suivi/:trackingCode — réutilise la session posée par /verifier (cookie), ou le
// lien magique inclus dans les emails (?token=...) pour éviter de redemander l'email.
export async function getSuivi(req: Request, res: Response) {
  const cookieToken = req.cookies?.[SESSION_COOKIE];
  const magicToken = typeof req.query.token === "string" ? req.query.token : undefined;
  const token = cookieToken ?? magicToken;
  if (!token) throw new HttpError(401, "Vérification requise");

  let payload;
  try {
    payload = verifyClientSession(token);
  } catch {
    throw new HttpError(401, "Session expirée, vérifiez à nouveau votre email");
  }

  const commande = await prisma.commande.findUnique({
    where: { id: payload.commandeId },
    include: { evenements: { orderBy: { createdAt: "asc" } }, entreprise: { select: { nom: true } } },
  });
  if (!commande || commande.trackingCode !== req.params.trackingCode) {
    throw new HttpError(401, "Vérification requise");
  }

  // Premier accès via le lien magique de l'email : on pose le cookie pour que
  // les visites suivantes (rafraîchissement, retour sur le site) n'aient plus
  // besoin du token dans l'URL.
  if (magicToken && !cookieToken) {
    setSessionCookie(res, magicToken);
  }

  res.json(serialize(commande));
}

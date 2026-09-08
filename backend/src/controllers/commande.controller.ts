import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { HttpError } from "../middleware/errorHandler";
import { generateTrackingCode } from "../utils/trackingCode";
import { signMagicLink } from "../utils/jwt";
import { geocodeAddress } from "../services/geocoding.service";
import { sendCommandeCreeeEmail, sendStatutMisAJourEmail } from "../services/email.service";

const createCommandeSchema = z.object({
  entrepriseId: z.string().optional(), // requis si l'appelant est admin
  clientNom: z.string().min(1),
  clientEmail: z.string().email(),
  clientTelephone: z.string().optional(),
  pointDepart: z.string().min(1),
  pointLivraison: z.string().min(1),
  description: z.string().min(1),
  prix: z.number().nonnegative(),
  delaiEstime: z.string().min(1),
});

async function generateUniqueTrackingCode(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const code = generateTrackingCode();
    const existing = await prisma.commande.findUnique({ where: { trackingCode: code } });
    if (!existing) return code;
  }
  throw new HttpError(500, "Impossible de générer un tracking code unique, réessayez");
}

export async function createCommande(req: Request, res: Response) {
  const data = createCommandeSchema.parse(req.body);
  const isAdmin = req.auth!.role === "admin";

  const entrepriseId = isAdmin ? data.entrepriseId : req.auth!.sub;
  if (!entrepriseId) throw new HttpError(400, "entrepriseId requis");

  const entreprise = await prisma.entreprise.findUnique({ where: { id: entrepriseId } });
  if (!entreprise) throw new HttpError(404, "Entreprise introuvable");

  const [depart, livraison] = await Promise.all([
    geocodeAddress(data.pointDepart).catch(() => null),
    geocodeAddress(data.pointLivraison).catch(() => null),
  ]);

  const trackingCode = await generateUniqueTrackingCode();

  const commande = await prisma.commande.create({
    data: {
      trackingCode,
      entrepriseId,
      creePar: isAdmin ? "ADMIN" : "ENTREPRISE",
      clientNom: data.clientNom,
      clientEmail: data.clientEmail,
      clientTelephone: data.clientTelephone,
      pointDepart: data.pointDepart,
      pointDepartLat: depart?.lat,
      pointDepartLng: depart?.lng,
      pointLivraison: data.pointLivraison,
      pointLivraisonLat: livraison?.lat,
      pointLivraisonLng: livraison?.lng,
      description: data.description,
      prix: data.prix,
      delaiEstime: data.delaiEstime,
      evenements: {
        create: {
          statut: "CREEE",
          message: "Commande créée",
        },
      },
    },
    include: { evenements: true },
  });

  await sendCommandeCreeeEmail({
    clientEmail: commande.clientEmail,
    clientNom: commande.clientNom,
    entrepriseNom: entreprise.nom,
    trackingCode: commande.trackingCode,
    pointDepart: commande.pointDepart,
    pointLivraison: commande.pointLivraison,
    delaiEstime: commande.delaiEstime,
    magicToken: signMagicLink({ commandeId: commande.id }),
  });

  res.status(201).json(commande);
}

export async function listCommandes(req: Request, res: Response) {
  const isAdmin = req.auth!.role === "admin";
  const commandes = await prisma.commande.findMany({
    where: isAdmin ? {} : { entrepriseId: req.auth!.sub },
    orderBy: { createdAt: "desc" },
    include: { evenements: { orderBy: { createdAt: "asc" } } },
  });
  res.json(commandes);
}

async function getOwnedCommande(commandeId: string, req: Request) {
  const commande = await prisma.commande.findUnique({
    where: { id: commandeId },
    include: { entreprise: true },
  });
  if (!commande) throw new HttpError(404, "Commande introuvable");

  const isAdmin = req.auth!.role === "admin";
  if (!isAdmin && commande.entrepriseId !== req.auth!.sub) {
    throw new HttpError(403, "Accès refusé");
  }
  return commande;
}

const addEventSchema = z.object({
  statut: z.enum([
    "CREEE",
    "EN_PREPARATION",
    "COLISAGE",
    "CHARGEMENT",
    "EN_TRANSIT",
    "EN_ARRET",
    "EN_LIVRAISON",
    "LIVREE",
    "PROBLEME",
    "ANNULEE",
  ]),
  message: z.string().min(1),
  localisation: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  notifierClient: z.boolean().default(false),
});

export async function addTrackingEvent(req: Request, res: Response) {
  const commande = await getOwnedCommande(req.params.commandeId, req);
  const data = addEventSchema.parse(req.body);

  // Coordonnées explicites (clic sur la carte) prioritaires ; sinon on géocode
  // le texte de localisation saisi par l'entreprise.
  let latitude = data.latitude;
  let longitude = data.longitude;
  if ((latitude === undefined || longitude === undefined) && data.localisation) {
    const geocoded = await geocodeAddress(data.localisation).catch(() => null);
    latitude = geocoded?.lat;
    longitude = geocoded?.lng;
  }

  const event = await prisma.trackingEvent.create({
    data: {
      commandeId: commande.id,
      statut: data.statut,
      message: data.message,
      localisation: data.localisation,
      latitude,
      longitude,
      notifie: data.notifierClient,
      notifieAt: data.notifierClient ? new Date() : null,
    },
  });

  await prisma.commande.update({
    where: { id: commande.id },
    data: { statutActuel: data.statut },
  });

  if (data.notifierClient) {
    await sendStatutMisAJourEmail({
      clientEmail: commande.clientEmail,
      clientNom: commande.clientNom,
      entrepriseNom: commande.entreprise.nom,
      trackingCode: commande.trackingCode,
      statut: data.statut,
      message: data.message,
      magicToken: signMagicLink({ commandeId: commande.id }),
    });
  }

  res.status(201).json(event);
}

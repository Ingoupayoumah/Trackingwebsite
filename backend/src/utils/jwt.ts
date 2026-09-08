import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type Role = "admin" | "entreprise";

export interface AuthTokenPayload {
  sub: string; // user id (Admin.id or Entreprise.id)
  role: Role;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
}

export interface ClientSessionPayload {
  commandeId: string;
}

export function signClientSession(payload: ClientSessionPayload): string {
  return jwt.sign(payload, env.clientSessionSecret, {
    expiresIn: env.clientSessionExpiresIn as any,
  });
}

export function verifyClientSession(token: string): ClientSessionPayload {
  return jwt.verify(token, env.clientSessionSecret) as ClientSessionPayload;
}

// Lien "magique" inclus dans les emails de suivi : reçu par email = identité déjà
// prouvée, donc pas besoin de redemander l'email en cliquant depuis le message.
// Durée de vie plus longue qu'une session de navigation classique, car l'email
// peut être rouvert des jours après son envoi.
export function signMagicLink(payload: ClientSessionPayload): string {
  return jwt.sign(payload, env.clientSessionSecret, { expiresIn: "30d" });
}

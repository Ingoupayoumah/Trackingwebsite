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

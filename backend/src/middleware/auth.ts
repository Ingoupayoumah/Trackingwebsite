import { NextFunction, Request, Response } from "express";
import { AuthTokenPayload, Role, verifyAuthToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthTokenPayload;
    }
  }
}

export function requireAuth(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

    if (!token) {
      return res.status(401).json({ error: "Authentification requise" });
    }

    try {
      const payload = verifyAuthToken(token);
      if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
        return res.status(403).json({ error: "Accès refusé" });
      }
      req.auth = payload;
      next();
    } catch {
      return res.status(401).json({ error: "Session invalide ou expirée" });
    }
  };
}

import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "./http.js";
import { isUserRole, type UserRole } from "./access.js";

export type AuthToken = {
  sub: string;
  email: string;
  role: UserRole;
  sv: number;
};

export function signToken(payload: AuthToken, secret: string, expiresIn: string): string {
  return jwt.sign(payload, secret, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
}

export function requireAuth(secret: string): RequestHandler {
  return (req, _res, next) => {
    const header = req.header("authorization") ?? "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      next(new HttpError(401, "UNAUTHORIZED", "Token ausente ou inválido."));
      return;
    }
    try {
      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
      if (!decoded.sub || typeof decoded.role !== "string" || !isUserRole(decoded.role)) {
        next(new HttpError(401, "UNAUTHORIZED", "Token ausente ou inválido."));
        return;
      }
      req.auth = {
        sub: String(decoded.sub),
        email: String(decoded.email ?? ""),
        role: decoded.role,
        sv: typeof decoded.sv === "number" ? decoded.sv : -1
      };
      next();
    } catch {
      next(new HttpError(401, "UNAUTHORIZED", "Token ausente ou inválido."));
    }
  };
}

export function requireAdmin(): RequestHandler {
  return (req, _res, next) => {
    if (!req.auth) {
      next(new HttpError(401, "UNAUTHORIZED", "Token ausente ou inválido."));
      return;
    }
    if (req.auth.role !== "administrador" && req.auth.role !== "administrador_suporte") {
      next(new HttpError(403, "FORBIDDEN", "Apenas administradores podem fazer esta operação."));
      return;
    }
    next();
  };
}

import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "./http.js";
import type { UserRole } from "./repositories/userRepository.js";

export type AuthToken = {
  sub: string;
  email: string;
  role: UserRole;
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
      if (!decoded.sub || (decoded.role !== "admin" && decoded.role !== "user")) {
        next(new HttpError(401, "UNAUTHORIZED", "Token ausente ou inválido."));
        return;
      }
      req.auth = {
        sub: String(decoded.sub),
        email: String(decoded.email ?? ""),
        role: decoded.role
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
    if (req.auth.role !== "admin") {
      next(new HttpError(403, "FORBIDDEN", "Apenas administradores podem fazer esta operação."));
      return;
    }
    next();
  };
}

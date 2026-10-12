import rateLimit from "express-rate-limit";
import { HttpError } from "./http.js";

export function buildLimiter(windowMs: number, limit: number) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (_req, _res, next) => {
      next(new HttpError(429, "RATE_LIMITED", "Muitas requisições. Tente novamente em instantes."));
    }
  });
}

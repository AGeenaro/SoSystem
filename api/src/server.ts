import "dotenv/config";
import { createApp } from "./app.js";
import { createSupabaseProductionRepository } from "./repositories/supabaseProductionRepository.js";
import { createSupabaseUserRepository } from "./repositories/supabaseUserRepository.js";

const port = Number(process.env.PORT || 3000);
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const jwtSecret = process.env.JWT_SECRET;

if (!supabaseUrl || !supabaseKey || !jwtSecret) {
  console.error("Defina SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e JWT_SECRET. Veja api/.env.example.");
  process.exit(1);
}

const corsOrigin = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = createApp({
  users: createSupabaseUserRepository(supabaseUrl, supabaseKey),
  production: createSupabaseProductionRepository(supabaseUrl, supabaseKey),
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 10),
  corsOrigin: corsOrigin.length === 1 && corsOrigin[0] === "*" ? true : corsOrigin,
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    limit: Number(process.env.RATE_LIMIT_MAX || 100),
    authLimit: Number(process.env.AUTH_RATE_LIMIT_MAX || 10)
  }
});

app.listen(port, () => {
  console.log(`API em http://localhost:${port}`);
  console.log(`Swagger em http://localhost:${port}/docs`);
});

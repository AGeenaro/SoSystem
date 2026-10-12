import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      sub: string;
      email: string;
      role: "visualizador" | "operador" | "administrador" | "administrador_suporte";
    };
  }
}

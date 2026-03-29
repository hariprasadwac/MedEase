import Fastify from "fastify";
import cors from "@fastify/cors";
import { ensureSeedData } from "./lib/seed.js";
import { registerAdminRoutes } from "./routes/admin.js";
import { registerPublicRoutes } from "./routes/public.js";

export async function buildServer() {
  const app = Fastify({ logger: false });

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:3000"]
  });

  app.get("/health", async () => ({ ok: true }));

  await app.register(registerPublicRoutes, { prefix: "/api" });
  await app.register(registerAdminRoutes, { prefix: "/api/admin" });

  return app;
}

async function start() {
  await ensureSeedData();
  const app = await buildServer();
  const port = Number(process.env.PORT ?? 4000);
  await app.listen({ port, host: "0.0.0.0" });
}

if (process.env.NODE_ENV !== "test") {
  start();
}

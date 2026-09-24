import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { citizenRoutes } from "./routes/citizens";

export const app = new Elysia()
  .use(
    cors({
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    })
  )
  .group("/api", (app) => app.use(citizenRoutes))
  .get("/", () => ({
    name: "API Layanan Dashboard Data Warga",
    version: "1.0.0",
    status: "online",
  }));

app.listen(3001);
console.log(`Backend Elysia berjalan di http://${app.server?.hostname || "localhost"}:${app.server?.port || 3001}`);

export type App = typeof app;

import dotenv from "dotenv";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import { connectDb } from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");
const envLocalPath = path.resolve(__dirname, "../.env.local");

dotenv.config({ path: envPath });
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
}

const PORT = process.env.PORT || 4000;

const start = async () => {
  if (String(process.env.SEED_ON_START || "").toLowerCase() === "true") {
    try {
      await import("../seed.js");
    } catch (error) {
      console.warn("[Seed] Error al ejecutar seed en arranque:", error);
    }
  }

  await connectDb();

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`API intranet escuchando en puerto ${PORT}`);
  });
};

start();

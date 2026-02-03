import dotenv from "dotenv";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import { connectDb } from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDb();

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`API intranet escuchando en puerto ${PORT}`);
  });
};

start();

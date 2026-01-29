import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import { connectDb } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDb();

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`API intranet escuchando en puerto ${PORT}`);
  });
};

start();

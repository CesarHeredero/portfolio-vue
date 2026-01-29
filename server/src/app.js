import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { ensureUploadsDir } from "./config/uploads.js";
import categoriesRouter from "./routes/categories.js";
import projectsRouter from "./routes/projects.js";
import skillsRouter from "./routes/skills.js";
import jobsRouter from "./routes/jobs.js";
import secondaryExperiencesRouter from "./routes/secondary-experiences.js";
import specialSectionsRouter from "./routes/special-sections.js";
import authRouter from "./routes/auth.js";
import uploadsRouter from "./routes/uploads.js";

const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const uploadsDir = ensureUploadsDir();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/secondary-experiences", secondaryExperiencesRouter);
app.use("/api/special-sections", specialSectionsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default app;

import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Archivo requerido" });
  }

  res.status(201).json({
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

export default router;

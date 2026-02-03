import { Router } from "express";
import About from "../models/About.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, async (req, res) => {
  const filter = req.user ? {} : { isVisible: true };
  const about = await About.find(filter).sort({ createdAt: -1 });
  res.json(about);
});

router.get("/:id", optionalAuth, async (req, res) => {
  const filter = req.user
    ? { _id: req.params.id }
    : { _id: req.params.id, isVisible: true };
  const about = await About.findOne(filter);

  if (!about) {
    return res.status(404).json({ message: "Sección Sobre mí no encontrada" });
  }

  res.json(about);
});

router.post("/", requireAuth, async (req, res) => {
  const about = await About.create(req.body);
  res.status(201).json(about);
});

router.put("/:id", requireAuth, async (req, res) => {
  const about = await About.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!about) {
    return res.status(404).json({ message: "Sección Sobre mí no encontrada" });
  }

  res.json(about);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const about = await About.findByIdAndDelete(req.params.id);
  if (!about) {
    return res.status(404).json({ message: "Sección Sobre mí no encontrada" });
  }

  res.status(204).send();
});

export default router;

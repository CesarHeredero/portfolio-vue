import { Router } from "express";
import Content from "../models/Content.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, async (req, res) => {
  const filter = req.user ? {} : { isVisible: true };

  if (req.query.locale) {
    filter.locale = req.query.locale.toLowerCase();
  }

  const content = await Content.find(filter).sort({ locale: 1 });
  res.json(content);
});

router.get("/:locale", optionalAuth, async (req, res) => {
  const filter = req.user
    ? { locale: req.params.locale.toLowerCase() }
    : { locale: req.params.locale.toLowerCase(), isVisible: true };

  const content = await Content.findOne(filter);
  if (!content) {
    return res.status(404).json({ message: "Contenido no encontrado" });
  }

  res.json(content);
});

router.post("/", requireAuth, async (req, res) => {
  const content = await Content.create(req.body);
  res.status(201).json(content);
});

router.put("/:id", requireAuth, async (req, res) => {
  const content = await Content.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!content) {
    return res.status(404).json({ message: "Contenido no encontrado" });
  }

  res.json(content);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const content = await Content.findByIdAndDelete(req.params.id);
  if (!content) {
    return res.status(404).json({ message: "Contenido no encontrado" });
  }

  res.status(204).send();
});

export default router;
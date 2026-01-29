import { Router } from "express";
import SpecialSection from "../models/SpecialSection.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, async (req, res) => {
  const filter = req.user ? {} : { isVisible: true };
  const sections = await SpecialSection.find(filter).sort({ createdAt: -1 });
  res.json(sections);
});

router.get("/:id", optionalAuth, async (req, res) => {
  const filter = req.user ? { _id: req.params.id } : { _id: req.params.id, isVisible: true };
  const section = await SpecialSection.findOne(filter);

  if (!section) {
    return res.status(404).json({ message: "Sección no encontrada" });
  }

  res.json(section);
});

router.post("/", requireAuth, async (req, res) => {
  const section = await SpecialSection.create(req.body);
  res.status(201).json(section);
});

router.put("/:id", requireAuth, async (req, res) => {
  const section = await SpecialSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!section) {
    return res.status(404).json({ message: "Sección no encontrada" });
  }

  res.json(section);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const section = await SpecialSection.findByIdAndDelete(req.params.id);
  if (!section) {
    return res.status(404).json({ message: "Sección no encontrada" });
  }

  res.status(204).send();
});

export default router;

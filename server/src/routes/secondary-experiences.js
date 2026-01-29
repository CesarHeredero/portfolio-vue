import { Router } from "express";
import SecondaryExperience from "../models/SecondaryExperience.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, async (req, res) => {
  const filter = req.user ? {} : { isVisible: true };
  const experiences = await SecondaryExperience.find(filter).sort({ createdAt: -1 });
  res.json(experiences);
});

router.get("/:id", optionalAuth, async (req, res) => {
  const filter = req.user ? { _id: req.params.id } : { _id: req.params.id, isVisible: true };
  const experience = await SecondaryExperience.findOne(filter);

  if (!experience) {
    return res.status(404).json({ message: "Experiencia no encontrada" });
  }

  res.json(experience);
});

router.post("/", requireAuth, async (req, res) => {
  const experience = await SecondaryExperience.create(req.body);
  res.status(201).json(experience);
});

router.put("/:id", requireAuth, async (req, res) => {
  const experience = await SecondaryExperience.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!experience) {
    return res.status(404).json({ message: "Experiencia no encontrada" });
  }

  res.json(experience);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const experience = await SecondaryExperience.findByIdAndDelete(req.params.id);
  if (!experience) {
    return res.status(404).json({ message: "Experiencia no encontrada" });
  }

  res.status(204).send();
});

export default router;

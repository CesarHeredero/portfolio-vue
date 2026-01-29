import { Router } from "express";
import Skill from "../models/Skill.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, async (req, res) => {
  const filter = req.user ? {} : { isVisible: true };

  if (req.query.category) {
    filter.category = req.query.category;
  }

  const skills = await Skill.find(filter).sort({ createdAt: -1 });
  res.json(skills);
});

router.get("/:id", optionalAuth, async (req, res) => {
  const filter = req.user ? { _id: req.params.id } : { _id: req.params.id, isVisible: true };
  const skill = await Skill.findOne(filter);

  if (!skill) {
    return res.status(404).json({ message: "Skill no encontrada" });
  }

  res.json(skill);
});

router.post("/", requireAuth, async (req, res) => {
  const skill = await Skill.create(req.body);
  res.status(201).json(skill);
});

router.put("/:id", requireAuth, async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!skill) {
    return res.status(404).json({ message: "Skill no encontrada" });
  }

  res.json(skill);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) {
    return res.status(404).json({ message: "Skill no encontrada" });
  }

  res.status(204).send();
});

export default router;

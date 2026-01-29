import { Router } from "express";
import Job from "../models/Job.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, async (req, res) => {
  const filter = req.user ? {} : { isVisible: true };

  const jobs = await Job.find(filter).sort({ createdAt: -1 });
  res.json(jobs);
});

router.get("/:id", optionalAuth, async (req, res) => {
  const filter = req.user ? { _id: req.params.id } : { _id: req.params.id, isVisible: true };
  const job = await Job.findOne(filter);

  if (!job) {
    return res.status(404).json({ message: "Experiencia no encontrada" });
  }

  res.json(job);
});

router.post("/", requireAuth, async (req, res) => {
  const job = await Job.create(req.body);
  res.status(201).json(job);
});

router.put("/:id", requireAuth, async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!job) {
    return res.status(404).json({ message: "Experiencia no encontrada" });
  }

  res.json(job);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) {
    return res.status(404).json({ message: "Experiencia no encontrada" });
  }

  res.status(204).send();
});

export default router;

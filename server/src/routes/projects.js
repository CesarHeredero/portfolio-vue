import { Router } from "express";
import Project from "../models/Project.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, async (req, res) => {
  const filter = req.user ? {} : { isVisible: true };

  if (req.query.categoryId) {
    filter.categoryId = req.query.categoryId;
  }

  if (req.query.experienceId) {
    filter.experienceId = req.query.experienceId;
  }

  const projects = await Project.find(filter)
    .populate("categoryId", "name")
    .populate("experienceId", "company title")
    .sort({ createdAt: -1 });

  res.json(projects);
});

router.get("/:id", optionalAuth, async (req, res) => {
  const filter = req.user ? { _id: req.params.id } : { _id: req.params.id, isVisible: true };
  const project = await Project.findOne(filter)
    .populate("categoryId", "name")
    .populate("experienceId", "company title");

  if (!project) {
    return res.status(404).json({ message: "Proyecto no encontrado" });
  }

  res.json(project);
});

router.post("/", requireAuth, async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
});

router.put("/:id", requireAuth, async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!project) {
    return res.status(404).json({ message: "Proyecto no encontrado" });
  }

  res.json(project);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Proyecto no encontrado" });
  }

  res.status(204).send();
});

export default router;

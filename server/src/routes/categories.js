import { Router } from "express";
import Category from "../models/Category.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, async (req, res) => {
  const filter = req.user ? {} : { isVisible: true };

  const categories = await Category.find(filter).sort({ createdAt: -1 });
  res.json(categories);
});

router.get("/:id", optionalAuth, async (req, res) => {
  const filter = req.user ? { _id: req.params.id } : { _id: req.params.id, isVisible: true };
  const category = await Category.findOne(filter);

  if (!category) {
    return res.status(404).json({ message: "Categoría no encontrada" });
  }

  res.json(category);
});

router.post("/", requireAuth, async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
});

router.put("/:id", requireAuth, async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!category) {
    return res.status(404).json({ message: "Categoría no encontrada" });
  }

  res.json(category);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Categoría no encontrada" });
  }

  res.status(204).send();
});

export default router;

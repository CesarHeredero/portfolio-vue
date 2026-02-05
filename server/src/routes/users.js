import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.json(
    users.map((user) => ({
      id: user._id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))
  );
});

router.post("/", requireAuth, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y password son requeridos" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ message: "Usuario ya existe" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email: normalizedEmail, passwordHash });

  res.status(201).json({ id: user._id, email: user.email });
});

router.put("/:id/password", requireAuth, async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password es requerido" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { passwordHash },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.json({ id: user._id, email: user.email });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.status(204).send();
});

export default router;

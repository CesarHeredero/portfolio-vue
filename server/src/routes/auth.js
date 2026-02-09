import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";

router.post("/register", requireAuth, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y password son requeridos" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Usuario ya existe" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });

  res.status(201).json({ id: user._id, email: user.email });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y password son requeridos" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const storedPassword = user.passwordHash || user.password || user.hash;
  if (!storedPassword) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const isBcryptHash =
    typeof storedPassword === "string" && storedPassword.startsWith("$2");
  let ok = false;

  if (isBcryptHash) {
    ok = await bcrypt.compare(password, storedPassword);
  } else {
    ok = password === storedPassword;
    if (ok) {
      const newHash = await bcrypt.hash(password, 10);
      const unset = {};
      if (user.password) unset.password = "";
      if (user.hash) unset.hash = "";

      await User.updateOne(
        { _id: user._id },
        {
          $set: { passwordHash: newHash },
          ...(Object.keys(unset).length ? { $unset: unset } : {}),
        }
      );
    }
  }
  if (!ok) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.json({ token });
});

router.post("/refresh", async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }

  const user = await User.findById(payload.id);
  if (!user) {
    return res.status(401).json({ message: "Token inválido" });
  }

  const refreshed = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.json({ token: refreshed });
});

export default router;

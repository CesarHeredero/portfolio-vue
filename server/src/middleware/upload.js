import multer from "multer";
import path from "path";
import { ensureUploadsDir } from "../config/uploads.js";

const uploadsDir = ensureUploadsDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${unique}${ext}`);
  },
});

export const upload = multer({ storage });

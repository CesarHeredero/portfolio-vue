import fs from "fs";
import path from "path";

export const ensureUploadsDir = () => {
  const uploadsDir = process.env.UPLOADS_DIR || path.resolve("uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  const { text, source = "es", target = "en" } = req.body || {};

  if (!text) {
    return res.status(400).json({ message: "Texto requerido para traducir" });
  }

  const libreUrl =
    process.env.TRANSLATE_URL ||
    process.env.LIBRETRANSLATE_URL ||
    "https://libretranslate.com/translate";
  const apiKey =
    process.env.TRANSLATE_API_KEY || process.env.LIBRETRANSLATE_API_KEY;
  const myMemoryEmail = process.env.MYMEMORY_EMAIL;

  try {
    const response = await fetch(libreUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source,
        target,
        format: "text",
        api_key: apiKey,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const translatedText =
        data.translatedText || data.translation || data.translated || "";

      if (translatedText) {
        return res.json({ translatedText });
      }
    }

    const fallbackUrl = new URL("https://api.mymemory.translated.net/get");
    fallbackUrl.searchParams.set("q", text);
    fallbackUrl.searchParams.set("langpair", `${source}|${target}`);
    if (myMemoryEmail) {
      fallbackUrl.searchParams.set("de", myMemoryEmail);
    }

    const fallbackResponse = await fetch(fallbackUrl.toString());
    if (!fallbackResponse.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return res.status(502).json({
        message: errorBody.error || errorBody.message || "Error traduciendo",
      });
    }

    const fallbackData = await fallbackResponse.json();
    const fallbackText = fallbackData?.responseData?.translatedText || "";
    if (!fallbackText) {
      return res.status(502).json({ message: "No se recibió traducción" });
    }

    res.json({ translatedText: fallbackText });
  } catch (error) {
    res.status(500).json({ message: "Error traduciendo" });
  }
});

export default router;

import express from "express";
import path from "path";
import { GoogleGenAI, Modality } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Initialize Gemini AI lazily/safely
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!ai && process.env.GEMINI_API_KEY) {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // High-precision Gemini TTS Endpoint for Arabic Speech Synthesis
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, voice = "Kore" } = req.body;

      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required" });
      }

      const client = getGeminiClient();
      if (!client) {
        return res.status(503).json({
          error: "Gemini API Key is not configured on the server",
          fallback: true,
        });
      }

      // Prompt tuned for precise Arabic pronunciation with diacritics
      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: text.trim() }] }],
        config: {
          systemInstruction:
            "You are a native Arabic speech synthesizer for children. Pronounce ONLY the exact provided Arabic text out loud with clear classical Arabic diacritics (tashkeel). Do NOT add any introductions, explanations, or extra words in English or Arabic.",
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || "Kore" },
            },
          },
        },
      });

      const candidatePart = response.candidates?.[0]?.content?.parts?.[0];
      const base64Audio = candidatePart?.inlineData?.data;
      const mimeType = candidatePart?.inlineData?.mimeType || "audio/pcm;rate=24000";

      if (base64Audio) {
        return res.json({ audio: base64Audio, mimeType });
      }

      return res.status(500).json({ error: "No audio data returned", fallback: true });
    } catch (err: any) {
      console.error("Gemini TTS Error:", err?.message || err);
      return res.status(500).json({
        error: err?.message || "Failed to generate AI speech",
        fallback: true,
      });
    }
  });

  // Vite development or static production build setup
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

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

      // Prompt tuned for precise Classical Arabic pronunciation and natural single nunation (tanween)
      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: text.trim() }] }],
        config: {
          systemInstruction:
            "You are a native Classical Arabic (Fusha) speech synthesizer and phonetician for children's educational applications. Pronounce the provided Arabic text with pristine diction, correct short vowels (tashkeel), and natural intonation.\n" +
            "CRITICAL PRONUNCIATION MANDATES:\n" +
            "1. NO DOUBLE NOON: When pronouncing Tanween (fat-h, damm, or kasr), pronounce it strictly as a single, clean nunation sound (-an, -un, -in). NEVER double the noon sound or say 'nan-na' or repeat syllables.\n" +
            "2. Ensure accurate articulation of Arabic phonemes: ث, ذ, ظ, ح, خ, ع, غ, ق, ص, ض, ط.\n" +
            "3. Honor Shaddah and short vowels (Fatha, Damma, Kasra) accurately.\n" +
            "4. Output ONLY the clear spoken audio of the exact input words without adding any introductions, explanations, or commentary.",
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

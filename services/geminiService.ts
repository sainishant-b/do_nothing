import { GoogleGenAI, Type } from "@google/genai";
import { QuoteData } from '../types';

const FALLBACK_QUOTE: QuoteData = {
  text: "Silence is the language of God, all else is poor translation.",
  author: "Rumi"
};

const getApiKey = (): string | undefined => {
  // Vite injects these at build-time through define in vite.config.ts.
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
  return key?.trim() ? key : undefined;
};

export const fetchZenWisdom = async (): Promise<QuoteData> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return FALLBACK_QUOTE;
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a short, profound, and calming quote about the art of doing nothing, silence, or stillness. It should be philosophical.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "The quote text itself."
            },
            author: {
              type: Type.STRING,
              description: "The author of the quote or 'Unknown' / 'Zen Proverb'"
            }
          },
          required: ["text", "author"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText) as QuoteData;
    return data;

  } catch (error) {
    console.error("Failed to fetch wisdom:", error);
    return FALLBACK_QUOTE;
  }
};

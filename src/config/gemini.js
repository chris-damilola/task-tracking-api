import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing.");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,

  httpOptions: {
    timeout: 120000,
    retryOptions: {
      attempts: 1,
    },
  },
});

export const GEMINI_MODEL = process.env.GEMINI_MODEL;

export default ai;

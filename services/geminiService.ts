
import { GoogleGenAI } from "@google/genai";
import { MODELS } from "../constants";

export interface TextGenerationConfig {
  model?: string;
  systemInstruction?: string;
  temperature?: number;
}

export class GeminiService {
  /**
   * Helper to execute a function with exponential backoff retry logic.
   * Retries on 429 (Rate Limit) and 5xx (Server Error) responses.
   */
  private async withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (err: any) {
        lastError = err;
        
        const errorMsg = err?.message?.toLowerCase() || "";
        const isRateLimit = errorMsg.includes("429") || errorMsg.includes("too many requests");
        const isServerError = errorMsg.includes("500") || errorMsg.includes("503") || errorMsg.includes("internal error");
        const isQuotaExceeded = errorMsg.includes("quota");

        const isRetryable = isRateLimit || isServerError || isQuotaExceeded;
        
        if (!isRetryable || i === maxRetries - 1) break;
        
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  }

  /**
   * Generates text content using the Gemini model with retries and dynamic config.
   */
  async generateText(prompt: string, config: TextGenerationConfig = {}) {
    return this.withRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: config.model || MODELS.TEXT,
        contents: prompt,
        config: {
          systemInstruction: config.systemInstruction || "You are a helpful automation assistant.",
          temperature: config.temperature ?? 0.7,
        }
      });
      return response.text;
    });
  }

  /**
   * Generates an image using the Gemini image model with retries.
   */
  async generateImage(prompt: string, aspectRatio: '1:1' | '16:9' | '9:16' = '1:1') {
    return this.withRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: MODELS.IMAGE,
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image data returned from model");
    });
  }
}

export const gemini = new GeminiService();

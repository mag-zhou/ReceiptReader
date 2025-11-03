
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysis } from '../types';

// FIX: Per coding guidelines, initialize GoogleGenAI directly with process.env.API_KEY.
// The API key is assumed to be set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

async function urlToGenerativePart(url: string, mimeType: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${url}`);
  }
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  // FIX: Cannot find name 'Buffer'. Replaced with a browser-compatible method for base64 encoding.
  const uint8Array = new Uint8Array(arrayBuffer);
  let binaryString = '';
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binaryString += String.fromCharCode(uint8Array[i]);
  }
  const base64String = btoa(binaryString);
  return {
    inlineData: {
      data: base64String,
      mimeType,
    },
  };
}

export async function verifyReceiptWithGemini(imageUrl: string): Promise<GeminiAnalysis> {
  // FIX: Removed API_KEY check as it is assumed to be present per guidelines.
  try {
    const imagePart = await urlToGenerativePart(imageUrl, "image/jpeg");

    const prompt = "Analyze this receipt image. Determine if it's a valid travel receipt. Look for a vendor name, a clear date, itemized purchases, and a total amount. Based on this, decide if it's valid. Respond only with the JSON object specified in the schema.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
          parts: [
              imagePart,
              { text: prompt },
          ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: {
              type: Type.BOOLEAN,
              description: "Whether the receipt appears to be a valid travel receipt.",
            },
            reason: {
              type: Type.STRING,
              description: "A brief, one-sentence explanation for the decision.",
            },
            vendor: {
              type: Type.STRING,
              description: "The name of the vendor or store on the receipt. 'N/A' if not found.",
            },
            totalAmount: {
              type: Type.STRING,
              description: "The total amount paid. 'N/A' if not found.",
            },
            date: {
              type: Type.STRING,
              description: "The date of the transaction. 'N/A' if not found.",
            },
          },
          required: ["isValid", "reason", "vendor", "totalAmount", "date"],
        },
      },
    });

    const jsonString = response.text;
    const parsedJson = JSON.parse(jsonString);
    return parsedJson as GeminiAnalysis;

  } catch (error) {
    console.error("Error verifying receipt with Gemini:", error);
    throw new Error("An error occurred while communicating with the AI service.");
  }
}

import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy",
});

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy") {
      return NextResponse.json({ reply: "Sorry, the AI is not configured right now." });
    }

    const systemInstruction = "You are a helpful, professional clinic assistant for a hospital system. You help users with general queries about booking appointments, hospital services, and basic health information. Do not provide critical medical diagnoses. Be concise and polite.";

    const contents = [];
    if (history && history.length > 0) {
      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    let response;
    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash-lite",
          contents: contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });
        break; // Success
      } catch (err: any) {
        retries--;
        if (retries === 0) throw err;
        console.warn(`Gemini API error, retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; // Exponential backoff
      }
    }

    return NextResponse.json({ reply: response?.text || "I'm having trouble responding right now." });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat query" },
      { status: 500 }
    );
  }
}

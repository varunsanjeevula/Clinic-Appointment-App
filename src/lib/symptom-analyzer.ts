import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TriageResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy" });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    severity: {
      type: Type.STRING,
      description: "Either 'critical' if immediate emergency care is needed, or 'normal' if it is non-urgent.",
    },
    matchedCritical: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of the critical symptoms identified in the text, ignoring negations (e.g., if they say 'no chest pain', do not list 'chest pain').",
    },
    matchedNormal: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of normal, non-urgent symptoms identified.",
    },
    suggestedSpecialties: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of recommended medical specialties. YOU MUST ONLY CHOOSE FROM THIS EXACT LIST: ['Emergency Medicine', 'General Medicine', 'General Surgery', 'Orthopedics', 'Cardiology', 'Cardiac Surgery', 'Vascular Surgery', 'Neurology', 'Neurosurgery', 'Psychiatry', 'Urology', 'Oncology', 'Nephrology', 'Ophthalmology', 'Dentistry', 'Gastroenterology', 'Gynecology', 'Pediatrics', 'Endocrinology', 'Dermatology', 'Cosmetic Surgery', 'Trichology', 'Sports Medicine', 'Physiotherapy', 'ENT', 'Pulmonology'].",
    },
    recommendation: {
      type: Type.STRING,
      description: "A short, professional medical recommendation sentence for the patient.",
    },
  },
  required: ["severity", "matchedCritical", "matchedNormal", "suggestedSpecialties", "recommendation"],
};

export async function analyzeSymptoms(symptoms: string): Promise<TriageResult> {
  // If no API key is provided, fallback to the old simple matching logic
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy") {
    console.warn("No GEMINI_API_KEY found, falling back to basic matching.");
    return fallbackAnalyze(symptoms);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `Patient symptoms description:\n"${symptoms}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });

    const result = JSON.parse(response.text!) as TriageResult;
    // ensure strict literal typing
    if (result.severity !== "critical" && result.severity !== "normal") {
      result.severity = "normal";
    }
    return result;
  } catch (error) {
    console.error("Gemini AI Triage Error:", error);
    return fallbackAnalyze(symptoms);
  }
}

// Keep the old logic as a robust fallback
function fallbackAnalyze(symptoms: string): TriageResult {
  const lower = symptoms.toLowerCase();
  const matchedCritical: string[] = [];
  const matchedNormal: string[] = [];
  const specialties = new Set<string>();

  const CRITICAL_KEYWORDS: Record<string, string[]> = {
    "Cardiology": ["chest pain", "heart attack"],
    "Emergency Medicine": ["unconscious", "bleeding", "seizure", "stroke", "anaphylaxis"],
    "Pulmonology": ["difficulty breathing", "shortness of breath", "choking"],
  };

  const NORMAL_KEYWORDS: Record<string, string[]> = {
    "General Medicine": ["fever", "cold", "cough", "sore throat", "nausea"],
    "Orthopedics": ["joint pain", "back pain", "sprain"],
  };

  for (const [specialty, keywords] of Object.entries(CRITICAL_KEYWORDS)) {
    for (const kw of keywords) { if (lower.includes(kw)) { matchedCritical.push(kw); specialties.add(specialty); } }
  }
  for (const [specialty, keywords] of Object.entries(NORMAL_KEYWORDS)) {
    for (const kw of keywords) { if (lower.includes(kw)) { matchedNormal.push(kw); specialties.add(specialty); } }
  }

  if (specialties.size === 0) specialties.add("General Medicine");

  const severity = matchedCritical.length > 0 ? "critical" : "normal";
  return {
    severity,
    matchedCritical: [...new Set(matchedCritical)],
    matchedNormal: [...new Set(matchedNormal)],
    suggestedSpecialties: [...specialties],
    recommendation: severity === "critical" ? "Urgent care needed." : "Non-urgent. Please book an appointment.",
  };
}

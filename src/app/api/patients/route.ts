import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { analyzeSymptoms } from "@/lib/symptom-analyzer";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { full_name, email, contact_number, dob, gender, address, symptoms, allergies, chronic_conditions } = body;
  
  if (!full_name || !contact_number || !address || !symptoms || !email) {
    return NextResponse.json({ error: "Missing required core fields" }, { status: 400 });
  }

  const triage = await analyzeSymptoms(symptoms);
  const { data, error } = await supabase.from("patients").upsert([
    { full_name, email, contact_number, dob, gender, address, symptoms, allergies, chronic_conditions, severity: triage.severity, ai_recommendation: triage.recommendation }
  ], { onConflict: "email" }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fire email dispatch asynchronously (don't block the response)
  const baseUrl = req.nextUrl.origin;
  fetch(`${baseUrl}/api/send-confirmation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      full_name,
      severity: triage.severity,
      recommendation: triage.recommendation,
      suggestedSpecialties: triage.suggestedSpecialties,
    })
  }).catch(e => console.error("Email dispatch error:", e));

  return NextResponse.json({ patient: data, triage });
}

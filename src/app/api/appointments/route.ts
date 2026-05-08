import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "medqueue-super-secret-key");

function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// Helper: get logged-in user email from JWT cookie
async function getUserEmail(req: NextRequest): Promise<string | null> {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return (payload.email as string) || null;
  } catch { return null; }
}

export async function GET() {
  const { data } = await supabase.from("appointments").select("*, patients(*)").eq("status", "confirmed").order("severity", { ascending: true }).order("created_at", { ascending: true });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // For TN local hospital/doctor IDs (non-UUID), set FK fields to null
  const record = {
    ...body,
    doctor_id: body.doctor_id && isUUID(body.doctor_id) ? body.doctor_id : null,
    hospital_id: body.hospital_id && isUUID(body.hospital_id) ? body.hospital_id : null,
  };

  const { data, error } = await supabase.from("appointments").insert([record]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const response = NextResponse.json(data);

  // Since patients table has a unique email constraint, we cannot safely update the patient's email
  // if they used a different email during registration. 
  // Instead, we will store the booked appointment IDs in a cookie so they always show up for this browser session.
  const existingCookie = req.cookies.get("booked-appointments")?.value || "";
  const newCookieValue = existingCookie ? `${existingCookie},${data.id}` : data.id;
  
  response.cookies.set({
    name: "booked-appointments",
    value: newCookieValue,
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return response;
}

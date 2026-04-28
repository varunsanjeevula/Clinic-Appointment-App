import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "medqueue-super-secret-key");

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const email = payload.email as string;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get patients associated with this email
    const { data: patients, error: patientError } = await supabase
      .from("patients")
      .select("id")
      .eq("email", email);

    if (patientError) {
      return NextResponse.json({ error: patientError.message }, { status: 500 });
    }

    if (!patients || patients.length === 0) {
      return NextResponse.json([]);
    }

    const patientIds = patients.map(p => p.id);

    // Get appointments for these patients
    const { data: appointments, error: appointmentError } = await supabase
      .from("appointments")
      .select("*, patients(*)")
      .in("patient_id", patientIds)
      .order("created_at", { ascending: false });

    if (appointmentError) {
      return NextResponse.json({ error: appointmentError.message }, { status: 500 });
    }

    return NextResponse.json(appointments ?? []);
  } catch (error: any) {
    console.error("Fetch user appointments error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

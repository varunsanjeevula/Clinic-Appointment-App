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
    const userName = payload.name as string;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all patients registered under this user's email
    const { data: patients } = await supabase
      .from("patients")
      .select("id")
      .eq("email", email);

    const patientIds = (patients ?? []).map(p => p.id);

    // Get any booked appointments stored in cookies (from local browser sessions)
    const bookedCookie = req.cookies.get("booked-appointments")?.value;
    const localAppointmentIds = bookedCookie ? bookedCookie.split(",").filter(id => id.length > 0) : [];

    // Build OR conditions for matching appointments
    const orConditions: string[] = [];

    if (patientIds.length > 0) {
      orConditions.push(`patient_id.in.(${patientIds.join(",")})`);
    }

    // Match by logged-in user's name
    if (userName) {
      orConditions.push(`patient_name.eq.${userName}`);
    }

    // Match by locally booked IDs
    if (localAppointmentIds.length > 0) {
      orConditions.push(`id.in.(${localAppointmentIds.join(",")})`);
    }

    if (orConditions.length === 0) {
      return NextResponse.json([]);
    }

    const { data: appointments, error } = await supabase
      .from("appointments")
      .select("*")
      .or(orConditions.join(","))
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(appointments ?? []);
  } catch (error: unknown) {
    console.error("Fetch user appointments error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

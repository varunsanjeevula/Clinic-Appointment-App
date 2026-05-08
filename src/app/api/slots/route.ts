import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export async function GET(req: NextRequest) {
  const doctorId = req.nextUrl.searchParams.get("doctor_id");
  const date = req.nextUrl.searchParams.get("date");
  if (!doctorId || !date) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  let query = supabase.from("appointments").select("time_slot").eq("appointment_date", date).eq("status", "confirmed");

  if (isUUID(doctorId)) {
    // Legacy Supabase UUID-based doctor
    query = query.eq("doctor_id", doctorId);
  } else {
    // TN local doctor ID — doctor_id is null in DB, so match by doctor_name
    // Import local doctor data to get the name
    const { TN_DOCTORS } = await import("@/lib/doctor-data");
    const doc = TN_DOCTORS.find(d => d.id === doctorId);
    if (doc) {
      query = query.eq("doctor_name", doc.name);
    } else {
      return NextResponse.json([]);
    }
  }

  const { data } = await query;
  return NextResponse.json((data ?? []).map((d) => d.time_slot));
}

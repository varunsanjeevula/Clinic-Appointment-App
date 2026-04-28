import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const doctorId = req.nextUrl.searchParams.get("doctor_id");
  const date = req.nextUrl.searchParams.get("date");
  if (!doctorId || !date) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  const { data } = await supabase.from("appointments").select("time_slot").eq("doctor_id", doctorId).eq("appointment_date", date).eq("status", "confirmed");
  return NextResponse.json((data ?? []).map((d) => d.time_slot));
}

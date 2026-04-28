import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];
  const [patients, todayAppts, critical, doctors] = await Promise.all([
    supabase.from("patients").select("id", { count: "exact", head: true }),
    supabase.from("appointments").select("id", { count: "exact", head: true }).eq("appointment_date", today).eq("status", "confirmed"),
    supabase.from("appointments").select("id", { count: "exact", head: true }).eq("severity", "critical").eq("status", "confirmed"),
    supabase.from("doctors").select("id", { count: "exact", head: true }).eq("is_available", true),
  ]);

  return NextResponse.json({
    totalPatients: patients.count ?? 0,
    todayAppointments: todayAppts.count ?? 0,
    criticalCases: critical.count ?? 0,
    availableDoctors: doctors.count ?? 0,
  });
}

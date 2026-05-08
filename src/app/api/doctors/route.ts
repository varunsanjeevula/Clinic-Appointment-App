import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TN_DOCTORS } from "@/lib/doctor-data";
import { TN_HOSPITALS } from "@/lib/hospital-data";

export async function GET(req: NextRequest) {
  const hospitalId = req.nextUrl.searchParams.get("hospital_id");

  // If the hospital_id matches our TN local format (e.g. ch-01, cb-02),
  // serve from local doctor data instead of Supabase
  const isTnHospital = hospitalId && TN_HOSPITALS.some(h => h.id === hospitalId);

  if (isTnHospital) {
    const doctors = TN_DOCTORS
      .filter(d => d.hospital_id === hospitalId)
      .map(d => {
        const hospital = TN_HOSPITALS.find(h => h.id === d.hospital_id);
        return {
          ...d,
          hospitals: hospital ? { name: hospital.name } : undefined,
        };
      });
    return NextResponse.json(doctors);
  }

  // Fallback to Supabase for legacy UUID-based hospital IDs
  let query = supabase.from("doctors").select("*, hospitals(name)").order("name");
  if (hospitalId) query = query.eq("hospital_id", hospitalId);
  const { data } = await query;
  return NextResponse.json(data ?? []);
}

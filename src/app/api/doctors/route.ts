import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const hospitalId = req.nextUrl.searchParams.get("hospital_id");
  let query = supabase.from("doctors").select("*, hospitals(name)").order("name");
  if (hospitalId) query = query.eq("hospital_id", hospitalId);
  const { data } = await query;
  return NextResponse.json(data ?? []);
}

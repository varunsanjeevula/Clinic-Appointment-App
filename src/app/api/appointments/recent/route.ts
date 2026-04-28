import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabase.from("appointments").select("*").eq("status", "confirmed").order("created_at", { ascending: false }).limit(8);
  return NextResponse.json(data ?? []);
}

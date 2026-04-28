import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password, otp } = await request.json();

    if (!name || !email || !password || !otp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify OTP
    const { data: otpData, error: otpError } = await supabase
      .from("auth_otps")
      .select("*")
      .eq("email", email)
      .eq("type", "signup")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpData) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    if (otpData.otp !== otp) {
      return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });
    }

    if (new Date() > new Date(otpData.expires_at)) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error: userError } = await supabase.from("users").insert([
      { name, email, password: hashedPassword }
    ]).select("id, name, email").single();

    if (userError) {
      console.error("User Creation Error:", userError);
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    // Delete OTP after successful signup
    await supabase.from("auth_otps").delete().eq("email", email).eq("type", "signup");

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

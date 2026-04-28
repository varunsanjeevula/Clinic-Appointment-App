import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email, type } = await request.json();

    if (!email || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type === "signup") {
      const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single();
      if (existingUser) {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 });
      }
    } else if (type === "reset_password") {
      const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single();
      if (!existingUser) {
        return NextResponse.json({ error: "Email not found" }, { status: 400 });
      }
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP valid for 10 minutes

    // Delete any existing OTPs for this email and type
    await supabase.from("auth_otps").delete().match({ email, type });

    // Store new OTP
    const { error: otpError } = await supabase.from("auth_otps").insert([
      { email, otp, type, expires_at: expiresAt.toISOString() }
    ]);

    if (otpError) {
      console.error("OTP Insert Error:", otpError);
      return NextResponse.json({ error: "Failed to generate OTP" }, { status: 500 });
    }

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tharanimahesh0308@gmail.com",
        pass: "dgct xgfp jspf oiku", // Ensure you are using the app password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const subject = type === "signup" ? "Verify your MedQueue account" : "Reset your MedQueue password";
    const action = type === "signup" ? "verify your account" : "reset your password";

    await transporter.sendMail({
      from: '"MedQueue" <tharanimahesh0308@gmail.com>',
      to: email,
      subject,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0d9488;">MedQueue Authentication</h2>
          <p>Please use the following OTP to ${action}:</p>
          <div style="background-color: #f0fdfa; border: 1px solid #14b8a6; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #0f766e;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 });
  }
}

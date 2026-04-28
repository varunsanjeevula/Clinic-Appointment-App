import { Resend } from "resend";
import { NextResponse } from "next/server";
import TriageConfirmationEmail from "@/emails/TriageConfirmationEmail";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_update_me");

export async function POST(req: Request) {
  try {
    const { email, full_name, severity, recommendation, suggestedSpecialties } = await req.json();

    if (!email || !full_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: "MedQueue <onboarding@resend.dev>", // using testing domain from Resend
      to: [email],
      subject: "Your Triage Registration & Appointment Tracker",
      react: TriageConfirmationEmail({
        patientName: full_name,
        severity,
        recommendation,
        suggestedSpecialties,
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import { AppointmentConfirmationEmail } from "@/emails/AppointmentConfirmationEmail";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tharanimahesh0308@gmail.com",
    pass: "dgct xgfp jspf oiku", // App Password provided
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, patientName, doctorName, hospitalName, specialty, date, timeSlot, confirmationCode } = body;

    if (!email) {
      return NextResponse.json({ error: "No email provided" }, { status: 400 });
    }

    const emailHtml = await render(
      AppointmentConfirmationEmail({
        patientName,
        doctorName,
        hospitalName,
        specialty,
        date,
        timeSlot,
        confirmationCode,
      })
    );

    const info = await transporter.sendMail({
      from: '"MedQueue" <tharanimahesh0308@gmail.com>',
      to: email,
      subject: `Appointment Confirmed - Code: ${confirmationCode}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Nodemailer error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

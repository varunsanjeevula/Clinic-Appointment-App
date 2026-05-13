import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import { AppointmentRescheduledEmail } from "@/emails/AppointmentRescheduledEmail";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tharanimahesh0308@gmail.com",
    pass: "dgct xgfp jspf oiku",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { new_date, new_time_slot, reason } = body;

    if (!new_date || !new_time_slot || !reason) {
      return NextResponse.json({ error: "Missing required fields: new_date, new_time_slot, reason" }, { status: 400 });
    }

    // 1. Get the current appointment
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // 2. Check if the new slot is available for the same doctor on the new date
    let slotQuery = supabase
      .from("appointments")
      .select("id")
      .eq("appointment_date", new_date)
      .eq("time_slot", new_time_slot)
      .eq("status", "confirmed")
      .neq("id", id); // Exclude the current appointment

    if (appointment.doctor_id && isUUID(appointment.doctor_id)) {
      slotQuery = slotQuery.eq("doctor_id", appointment.doctor_id);
    } else {
      // For TN local doctors, match by doctor_name
      slotQuery = slotQuery.eq("doctor_name", appointment.doctor_name);
    }

    const { data: conflicting } = await slotQuery;

    if (conflicting && conflicting.length > 0) {
      return NextResponse.json({ error: "This time slot is already booked for the selected date" }, { status: 409 });
    }

    // 3. Store old values before updating
    const oldDate = appointment.appointment_date;
    const oldTimeSlot = appointment.time_slot;

    // 4. Update the appointment
    const { data: updated, error: updateError } = await supabase
      .from("appointments")
      .update({
        appointment_date: new_date,
        time_slot: new_time_slot,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 5. Look up the patient's email and send notification
    let patientEmail: string | null = null;

    if (appointment.patient_id) {
      const { data: patient } = await supabase
        .from("patients")
        .select("email")
        .eq("id", appointment.patient_id)
        .single();

      patientEmail = patient?.email || null;
    }

    if (patientEmail) {
      try {
        const formatDate = (d: string) =>
          new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          });

        const emailHtml = await render(
          AppointmentRescheduledEmail({
            patientName: appointment.patient_name,
            doctorName: appointment.doctor_name,
            hospitalName: appointment.hospital_name,
            specialty: appointment.specialty || "General",
            oldDate: formatDate(oldDate),
            oldTimeSlot: oldTimeSlot,
            newDate: formatDate(new_date),
            newTimeSlot: new_time_slot,
            reason,
          })
        );

        await transporter.sendMail({
          from: '"MedQueue" <tharanimahesh0308@gmail.com>',
          to: patientEmail,
          subject: `Appointment Rescheduled - New Time: ${new_time_slot} on ${new_date}`,
          html: emailHtml,
        });
      } catch (emailErr) {
        // Log email failure but don't fail the reschedule itself
        console.error("Failed to send reschedule email:", emailErr);
      }
    }

    return NextResponse.json({ success: true, appointment: updated, emailSent: !!patientEmail });
  } catch (error) {
    console.error("Reschedule error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

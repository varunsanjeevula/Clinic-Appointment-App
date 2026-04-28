"use client";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDoctors, useBookedSlots, useBookAppointment } from "@/lib/queries";
import { useBookingState } from "@/lib/booking-context";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Star, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";

const TIME_SLOTS = ["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM"];

function getNextDays(n = 7) {
  const days: { date: string; day: string; num: number; month: string }[] = [];
  const d = new Date(); d.setDate(d.getDate() + 1);
  while (days.length < n) {
    if (d.getDay() !== 0) {
      days.push({ date: d.toISOString().split("T")[0], day: d.toLocaleDateString("en-IN", { weekday: "short" }), num: d.getDate(), month: d.toLocaleDateString("en-IN", { month: "short" }) });
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function BookPageInner() {
  const params = useSearchParams();
  const hospitalId = params.get("hospital") ?? "";
  const { data: doctors, isLoading } = useDoctors(hospitalId);
  const bookMutation = useBookAppointment();
  const { patient, triage, clear } = useBookingState();
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [booked, setBooked] = useState(false);
  const { data: bookedSlots } = useBookedSlots(doctorId, date);
  const selectedDoc = doctors?.find(d => d.id === doctorId);
  const days = getNextDays(7);

  async function handleBook() {
    if (!selectedDoc || !date || !slot || !patient || !triage) return;
    await bookMutation.mutateAsync({
      patient_id: patient.id, patient_name: patient.full_name, doctor_id: doctorId, doctor_name: selectedDoc.name,
      hospital_id: hospitalId, hospital_name: selectedDoc.hospitals?.name ?? "", specialty: selectedDoc.specialty,
      appointment_date: date, time_slot: slot, severity: triage.severity, status: "confirmed",
    });

    const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    if (patient.email) {
      fetch("/api/send-appointment-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: patient.email,
          patientName: patient.full_name,
          doctorName: selectedDoc.name,
          hospitalName: selectedDoc.hospitals?.name ?? "",
          specialty: selectedDoc.specialty,
          date,
          timeSlot: slot,
          confirmationCode,
        }),
      }).catch(console.error);
    }

    setBooked(true);
    clear();
  }

  if (booked) return (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
      <Card className="max-w-lg mx-auto mt-12"><CardContent className="py-12 text-center">
        <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-primary mb-2">Appointment Booked!</h2>
        <p className="text-sm text-muted-foreground mb-6">Successfully scheduled with {selectedDoc?.name}.</p>
        <div className="flex gap-3 justify-center">
          <Button asChild><Link href="/queue">View Queue</Link></Button>
          <Button variant="outline" asChild><Link href="/register">New Patient</Link></Button>
        </div>
      </CardContent></Card>
    </motion.div>
  );

  if (!patient || !triage) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="max-w-lg mx-auto mt-12"><CardContent className="py-12 text-center">
          <AlertTriangle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Patient Selected</h2>
          <p className="text-sm text-muted-foreground mb-6">Please register a patient before booking an appointment.</p>
          <Button asChild><Link href="/register">Go to Registration</Link></Button>
        </CardContent></Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div><h1 className="text-2xl font-bold tracking-tight">Book Appointment</h1><p className="text-sm text-muted-foreground">Select doctor, date, and time slot.</p></div>

      {/* Step 1: Doctor */}
      <div>
        <h3 className="text-sm font-semibold mb-3">1. Select Doctor</h3>
        {isLoading ? <div className="grid grid-cols-1 gap-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div> : (
          <div className="grid grid-cols-1 gap-2">
            {[...(doctors ?? [])].sort((a, b) => {
              const aMatch = triage?.suggestedSpecialties.includes(a.specialty) ? 1 : 0;
              const bMatch = triage?.suggestedSpecialties.includes(b.specialty) ? 1 : 0;
              return bMatch - aMatch || b.rating - a.rating;
            }).slice(0, 3).map(d => {
              const initials = d.name.split(" ").map(w => w[0]).join("").substring(0, 2);
              const isMatch = triage?.suggestedSpecialties.includes(d.specialty);
              return (
                <Card key={d.id} className={`cursor-pointer transition-all ${doctorId === d.id ? "border-primary bg-primary/5 shadow-sm" : "hover:border-muted-foreground/20"}`} onClick={() => { setDoctorId(d.id); setDate(""); setSlot(""); }}>
                  <CardContent className="flex items-center gap-3 p-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{initials}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium flex items-center gap-2">
                        {d.name} {isMatch && <Badge variant="default" className="text-[9px] h-4 bg-teal-500 hover:bg-teal-600">Best Match</Badge>}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{d.specialty} · {d.experience_years} yrs · <Star className="w-3 h-3 inline text-amber-500 fill-amber-500" /> {d.rating}</p>
                    </div>
                    {doctorId === d.id && <Badge className="text-[9px]">Selected</Badge>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Step 2: Date */}
      {doctorId && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-sm font-semibold mb-3">2. Pick Date</h3>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {days.map(d => (
              <button key={d.date} onClick={() => { setDate(d.date); setSlot(""); }} className={`p-3 rounded-xl border text-center transition-all ${date === d.date ? "border-primary bg-primary/10 text-primary" : "hover:border-muted-foreground/30"}`}>
                <div className="text-[10px] uppercase text-muted-foreground">{d.day}</div>
                <div className="text-lg font-bold">{d.num}</div>
                <div className="text-[10px] text-muted-foreground">{d.month}</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 3: Slot */}
      {date && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-sm font-semibold mb-3">3. Choose Time Slot</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {TIME_SLOTS.map(s => {
              const isBooked = bookedSlots?.includes(s);
              return (
                <button key={s} disabled={isBooked} onClick={() => setSlot(s)} className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${isBooked ? "opacity-25 cursor-not-allowed line-through" : slot === s ? "bg-primary text-primary-foreground border-primary" : "hover:border-primary/40"}`}>
                  {s}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Confirm */}
      {slot && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card><CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-3">Confirm Appointment</h3>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="bg-muted/50 rounded-lg p-3"><p className="text-[10px] text-muted-foreground uppercase font-semibold mb-0.5">Doctor</p><p className="font-medium">{selectedDoc?.name}</p></div>
              <div className="bg-muted/50 rounded-lg p-3"><p className="text-[10px] text-muted-foreground uppercase font-semibold mb-0.5">Specialty</p><p className="font-medium">{selectedDoc?.specialty}</p></div>
              <div className="bg-muted/50 rounded-lg p-3"><p className="text-[10px] text-muted-foreground uppercase font-semibold mb-0.5">Date</p><p className="font-medium">{new Date(date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</p></div>
              <div className="bg-muted/50 rounded-lg p-3"><p className="text-[10px] text-muted-foreground uppercase font-semibold mb-0.5">Time</p><p className="font-medium">{slot}</p></div>
            </div>
            <Button className="w-full active:scale-[0.98] transition-transform" onClick={handleBook} disabled={bookMutation.isPending}>
              {bookMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Booking...</> : "✓ Confirm Appointment"}
            </Button>
          </CardContent></Card>
        </motion.div>
      )}
    </div>
  );
}

export default function BookPage() {
  return <AppShell><Suspense fallback={<Skeleton className="h-40 w-full" />}><BookPageInner /></Suspense></AppShell>;
}

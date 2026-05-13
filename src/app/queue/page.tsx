"use client";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAppointmentQueue, useCancelAppointment, useRescheduleAppointment, useBookedSlots, useUser } from "@/lib/queries";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShieldAlert, CalendarClock, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { Appointment } from "@/lib/types";

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

export default function QueuePage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: appointments, isLoading } = useAppointmentQueue();
  const cancelMutation = useCancelAppointment();
  const rescheduleMutation = useRescheduleAppointment();
  const [filter, setFilter] = useState("all");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [viewAppointment, setViewAppointment] = useState<Appointment | null>(null);

  // Reschedule state
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [reason, setReason] = useState("");
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");

  const isAdmin = user?.email?.toLowerCase() === "admin@gmail.com";

  const rescheduleDoctorId = rescheduleAppointment?.doctor_id || rescheduleAppointment?.doctor_name || "";
  const { data: bookedSlots } = useBookedSlots(rescheduleDoctorId, newDate);

  const days = getNextDays(7);

  if (!userLoading && !isAdmin) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground mt-2">Only administrators can access the appointment queue.</p>
        </div>
      </AppShell>
    );
  }

  const filtered = (appointments ?? []).filter(a => filter === "all" || a.severity === filter);
  const critical = filtered.filter(a => a.severity === "critical");
  const normal = filtered.filter(a => a.severity === "normal");

  async function handleCancel() {
    if (!cancelId) return;
    await cancelMutation.mutateAsync(cancelId);
    setCancelId(null);
  }

  function openReschedule(appointment: Appointment) {
    setRescheduleAppointment(appointment);
    setNewDate("");
    setNewSlot("");
    setReason("");
    setRescheduleSuccess(false);
    setRescheduleError("");
  }

  function closeReschedule() {
    setRescheduleAppointment(null);
    setNewDate("");
    setNewSlot("");
    setReason("");
    setRescheduleSuccess(false);
    setRescheduleError("");
  }

  async function handleReschedule() {
    if (!rescheduleAppointment || !newDate || !newSlot || !reason.trim()) return;
    setRescheduleError("");
    try {
      await rescheduleMutation.mutateAsync({
        id: rescheduleAppointment.id,
        new_date: newDate,
        new_time_slot: newSlot,
        reason: reason.trim(),
      });
      setRescheduleSuccess(true);
    } catch (err: unknown) {
      setRescheduleError(err instanceof Error ? err.message : "Failed to reschedule");
    }
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Appointment Queue</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Priority-ordered — critical patients first.</p>
          </div>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="h-8 sm:h-9">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All <span className="ml-1 text-[10px] opacity-60">({appointments?.length ?? 0})</span></TabsTrigger>
              <TabsTrigger value="critical" className="text-xs sm:text-sm">Critical</TabsTrigger>
              <TabsTrigger value="normal" className="text-xs sm:text-sm">Normal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground text-sm">📋 No appointments found</CardContent></Card>
        ) : (
          <>
            {critical.length > 0 && <QueueSection label="Critical" count={critical.length} items={critical} color="destructive" onCancel={setCancelId} onView={setViewAppointment} onReschedule={openReschedule} />}
            {normal.length > 0 && <QueueSection label="Normal" count={normal.length} items={normal} color="primary" onCancel={setCancelId} onView={setViewAppointment} onReschedule={openReschedule} startPos={critical.length + 1} />}
          </>
        )}

        {/* Cancel Dialog */}
        <Dialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Cancel Appointment?</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">Are you sure you want to cancel this appointment?</p>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setCancelId(null)}>Keep</Button>
              <Button variant="destructive" onClick={handleCancel} disabled={cancelMutation.isPending}>
                {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog open={!!viewAppointment} onOpenChange={() => setViewAppointment(null)}>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Patient Details</DialogTitle></DialogHeader>
            {viewAppointment?.patients ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Name</span>
                    <p className="font-medium">{viewAppointment.patients.full_name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Contact</span>
                    <p className="font-medium">{viewAppointment.patients.contact_number}</p>
                  </div>
                  {viewAppointment.patients.email && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Email</span>
                      <p className="font-medium text-xs break-all">{viewAppointment.patients.email}</p>
                    </div>
                  )}
                  {viewAppointment.patients.dob && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-semibold">DOB</span>
                      <p className="font-medium">{viewAppointment.patients.dob}</p>
                    </div>
                  )}
                  {viewAppointment.patients.gender && (
                    <div className="col-span-2">
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Gender</span>
                      <p className="font-medium capitalize">{viewAppointment.patients.gender}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Address</span>
                    <p className="font-medium">{viewAppointment.patients.address}</p>
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded-lg space-y-2">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Symptoms</span>
                    <p className="text-sm">{viewAppointment.patients.symptoms}</p>
                  </div>
                  {viewAppointment.patients.allergies && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Allergies</span>
                      <p className="text-sm text-amber-600">{viewAppointment.patients.allergies}</p>
                    </div>
                  )}
                  {viewAppointment.patients.chronic_conditions && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Chronic Conditions</span>
                      <p className="text-sm text-destructive">{viewAppointment.patients.chronic_conditions}</p>
                    </div>
                  )}
                </div>

                {viewAppointment.patients.ai_recommendation && (
                  <div className="bg-teal-50 border border-teal-100 p-3 rounded-lg">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1 flex items-center gap-1">
                      <Star className="w-3 h-3" /> Gemini AI Analysis
                    </h3>
                    <p className="text-sm text-teal-900 leading-relaxed font-medium">
                      {viewAppointment.patients.ai_recommendation}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Patient details not found.</p>
            )}
            <DialogFooter>
              <Button onClick={() => setViewAppointment(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reschedule Dialog */}
        <Dialog open={!!rescheduleAppointment} onOpenChange={(open) => { if (!open) closeReschedule(); }}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-primary" />
                Reschedule Appointment
              </DialogTitle>
            </DialogHeader>

            {rescheduleSuccess ? (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
                <h3 className="text-lg font-bold text-primary">Rescheduled Successfully!</h3>
                <p className="text-sm text-muted-foreground">
                  The appointment has been moved and the patient has been notified via email.
                </p>
                <Button onClick={closeReschedule} className="mt-2">Close</Button>
              </motion.div>
            ) : (
              <div className="space-y-5">
                {rescheduleAppointment && (
                  <div className="bg-muted/60 rounded-lg p-3 border space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Current Appointment</p>
                    <p className="text-sm font-semibold">{rescheduleAppointment.patient_name}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      <span>👨‍⚕️ {rescheduleAppointment.doctor_name}</span>
                      <span>📅 {new Date(rescheduleAppointment.appointment_date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span>🕐 {rescheduleAppointment.time_slot}</span>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold mb-2">1. Select New Date</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {days.map(d => (
                      <button
                        key={d.date}
                        onClick={() => { setNewDate(d.date); setNewSlot(""); }}
                        className={`p-2 rounded-xl border text-center transition-all ${newDate === d.date ? "border-primary bg-primary/10 text-primary" : "hover:border-muted-foreground/30"}`}
                      >
                        <div className="text-[9px] uppercase text-muted-foreground">{d.day}</div>
                        <div className="text-base font-bold">{d.num}</div>
                        <div className="text-[9px] text-muted-foreground">{d.month}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {newDate && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <h4 className="text-sm font-semibold mb-2">2. Choose New Time Slot</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {TIME_SLOTS.map(s => {
                        const isBooked = bookedSlots?.includes(s);
                        const isOldSlot = newDate === rescheduleAppointment?.appointment_date && s === rescheduleAppointment?.time_slot;
                        return (
                          <button
                            key={s}
                            disabled={isBooked && !isOldSlot}
                            onClick={() => setNewSlot(s)}
                            className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-all ${
                              isBooked && !isOldSlot
                                ? "opacity-25 cursor-not-allowed line-through"
                                : newSlot === s
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "hover:border-primary/40"
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {newSlot && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <h4 className="text-sm font-semibold mb-2">3. Reason for Rescheduling</h4>
                    <Textarea
                      placeholder="e.g., Doctor unavailable, emergency rescheduling, patient request..."
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      className="min-h-[80px] text-sm"
                    />
                  </motion.div>
                )}

                {newDate && newSlot && reason.trim() && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-gradient-to-r from-muted/50 to-primary/5 rounded-lg p-3 sm:p-4 border space-y-3">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Change Summary</p>
                      <div className="flex items-center gap-2 sm:gap-3 text-sm">
                        <div className="flex-1 bg-red-50 dark:bg-red-950/30 rounded-lg p-2 text-center border border-red-200 dark:border-red-800">
                          <p className="text-[9px] uppercase font-bold text-red-500 mb-0.5">Previous</p>
                          <p className="font-medium text-red-700 dark:text-red-400 text-xs line-through">
                            {new Date(rescheduleAppointment!.appointment_date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </p>
                          <p className="text-red-600 dark:text-red-400 text-[11px] line-through">{rescheduleAppointment!.time_slot}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 bg-teal-50 dark:bg-teal-950/30 rounded-lg p-2 text-center border border-teal-200 dark:border-teal-800">
                          <p className="text-[9px] uppercase font-bold text-teal-600 mb-0.5">New</p>
                          <p className="font-bold text-teal-700 dark:text-teal-400 text-xs">
                            {new Date(newDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </p>
                          <p className="text-teal-600 dark:text-teal-400 text-[11px] font-semibold">{newSlot}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {rescheduleError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {rescheduleError}
                  </div>
                )}

                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="ghost" onClick={closeReschedule}>Cancel</Button>
                  <Button
                    onClick={handleReschedule}
                    disabled={!newDate || !newSlot || !reason.trim() || rescheduleMutation.isPending}
                    className="gap-2"
                  >
                    {rescheduleMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />Rescheduling...</>
                    ) : (
                      <><CalendarClock className="w-4 h-4" />Confirm Reschedule</>
                    )}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

function QueueSection({ label, count, items, color, onCancel, onView, onReschedule, startPos = 1 }: {
  label: string; count: number; items: Appointment[]; color: string; onCancel: (id: string) => void; onView: (app: Appointment) => void; onReschedule: (app: Appointment) => void; startPos?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <div className={`w-2 h-2 rounded-full bg-${color} shadow-[0_0_6px] shadow-${color}/40`} />
        {label} ({count})
      </div>
      {items.map((a, i) => (
        <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.25 }}>
          <Card className="group hover:shadow-sm transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-extrabold text-xs sm:text-sm flex-shrink-0 ${color === "destructive" ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-primary/10 text-primary border border-primary/20"}`}>
                  {startPos + i}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm truncate">{a.patient_name}</span>
                    <Badge variant={a.severity === "critical" ? "destructive" : "secondary"} className="text-[9px]">{a.severity}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                    <span>👨‍⚕️ {a.doctor_name}</span>
                    <span>🏥 {a.hospital_name}</span>
                    <span>📅 {new Date(a.appointment_date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    <span>🕐 {a.time_slot}</span>
                  </div>
                </div>
              </div>
              {/* Action buttons — always visible on mobile, hover-reveal on desktop */}
              <div className="flex gap-2 mt-3 pt-2 border-t border-border/50 lg:mt-0 lg:pt-0 lg:border-0 lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:absolute lg:right-4 lg:top-1/2 lg:-translate-y-1/2">
                <Button variant="outline" size="sm" className="text-xs flex-1 lg:flex-none h-8" onClick={() => onView(a)}>
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 flex-1 lg:flex-none h-8"
                  onClick={() => onReschedule(a)}
                >
                  <CalendarClock className="w-3 h-3 mr-1" />
                  Reschedule
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 flex-1 lg:flex-none h-8" onClick={() => onCancel(a.id)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

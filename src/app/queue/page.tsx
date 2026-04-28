"use client";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAppointmentQueue, useCancelAppointment, useUser } from "@/lib/queries";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShieldAlert } from "lucide-react";
import type { Appointment } from "@/lib/types";

export default function QueuePage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: appointments, isLoading } = useAppointmentQueue();
  const cancelMutation = useCancelAppointment();
  const [filter, setFilter] = useState("all");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [viewAppointment, setViewAppointment] = useState<Appointment | null>(null);

  const isAdmin = user?.email?.toLowerCase() === "admin@gmail.com";

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

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Appointment Queue</h1>
            <p className="text-sm text-muted-foreground">Priority-ordered — critical patients first.</p>
          </div>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All <span className="ml-1 text-[10px] opacity-60">({appointments?.length ?? 0})</span></TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="normal">Normal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground text-sm">📋 No appointments found</CardContent></Card>
        ) : (
          <>
            {critical.length > 0 && <QueueSection label="Critical" count={critical.length} items={critical} color="destructive" onCancel={setCancelId} onView={setViewAppointment} />}
            {normal.length > 0 && <QueueSection label="Normal" count={normal.length} items={normal} color="primary" onCancel={setCancelId} onView={setViewAppointment} startPos={critical.length + 1} />}
          </>
        )}

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

        <Dialog open={!!viewAppointment} onOpenChange={() => setViewAppointment(null)}>
          <DialogContent className="max-w-md">
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
                      <p className="font-medium">{viewAppointment.patients.email}</p>
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
      </div>
    </AppShell>
  );
}

function QueueSection({ label, count, items, color, onCancel, onView, startPos = 1 }: {
  label: string; count: number; items: Appointment[]; color: string; onCancel: (id: string) => void; onView: (app: Appointment) => void; startPos?: number;
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
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm ${color === "destructive" ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-primary/10 text-primary border border-primary/20"}`}>
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
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => onView(a)}>
                  View
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onCancel(a.id)}>
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

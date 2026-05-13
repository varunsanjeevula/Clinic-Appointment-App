"use client";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDoctors, useDoctorLeaves, useSetDoctorLeave, useUser } from "@/lib/queries";
import { Search, Star, ShieldAlert } from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { Doctor } from "@/lib/types";

export default function DoctorsPage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: doctors, isLoading } = useDoctors();
  const [search, setSearch] = useState("");
  const [leaveDoctor, setLeaveDoctor] = useState<Doctor | null>(null);

  const isAdmin = user?.email?.toLowerCase() === "admin@gmail.com";

  if (!userLoading && !isAdmin) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground mt-2">Only administrators can manage doctors.</p>
        </div>
      </AppShell>
    );
  }

  const filtered = useMemo(() => {
    if (!doctors) return [];
    const q = search.toLowerCase();
    return doctors.filter(d => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q));
  }, [doctors, search]);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Doctor Management</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">View all doctors, availability status, and manage leaves.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground text-sm">No doctors found</CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((doc, i) => (
              <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.25 }}>
                <DoctorCard doctor={doc} onManageLeave={() => setLeaveDoctor(doc)} />
              </motion.div>
            ))}
          </div>
        )}

        {leaveDoctor && <LeaveDialog doctor={leaveDoctor} onClose={() => setLeaveDoctor(null)} />}
      </div>
    </AppShell>
  );
}

function DoctorCard({ doctor: d, onManageLeave }: { doctor: Doctor; onManageLeave: () => void }) {
  const { data: leaves } = useDoctorLeaves(d.id);
  const hasLeave = (leaves ?? []).length > 0;
  const hospital = d.hospitals?.name ?? "Unknown";
  const initials = d.name.split(" ").map(w => w[0]).join("").substring(0, 2);
  const colors = ["bg-teal-500", "bg-blue-500", "bg-violet-500", "bg-amber-500", "bg-rose-500", "bg-emerald-500"];
  const bgColor = colors[d.name.length % colors.length];

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${bgColor}`}>
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm">{d.name}</h3>
            <p className="text-xs text-muted-foreground">{d.specialty}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground mb-3">
          <span>🏥 {hospital}</span>
          <span>📅 {d.experience_years} yrs</span>
          <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-500 fill-amber-500" />{d.rating}</span>
        </div>
        {hasLeave && (
          <div className="bg-violet-500/5 border border-violet-500/15 rounded-lg p-2.5 mb-3 text-[11px] text-violet-600 dark:text-violet-400">
            📌 Leave: {new Date(leaves![0].leave_start + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })} — {new Date(leaves![0].leave_end + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ({leaves![0].reason})
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs">{d.is_available ? "✅ Available" : "❌ Unavailable"}</span>
          <Button variant="outline" size="sm" className="text-xs h-7" onClick={onManageLeave}>Manage Leave</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LeaveDialog({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const leaveMutation = useSetDoctorLeave();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await leaveMutation.mutateAsync({
      doctorId: doctor.id,
      data: { leave_start: fd.get("start") as string, leave_end: fd.get("end") as string, reason: fd.get("reason") as string },
    });
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Set Leave — {doctor.name}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Start</Label><Input type="date" name="start" min={tomorrow} required /></div>
            <div className="space-y-1.5"><Label className="text-xs">End</Label><Input type="date" name="end" min={tomorrow} required /></div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Reason</Label>
            <Select name="reason" defaultValue="Vacation">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Vacation">Vacation</SelectItem>
                <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                <SelectItem value="Conference">Conference</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={leaveMutation.isPending}>{leaveMutation.isPending ? "Setting..." : "Set Leave"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

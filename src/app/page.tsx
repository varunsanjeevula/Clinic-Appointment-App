"use client";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStats, useRecentAppointments, useUser } from "@/lib/queries";
import { Users, CalendarCheck, AlertCircle, HeartPulse, UserPlus, ClipboardList, Stethoscope, TrendingUp, Clock, LogOut, Mail, Calendar as CalendarIcon, CalendarDays } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockChartData = [
  { day: "Mon", appointments: 12 }, { day: "Tue", appointments: 18 },
  { day: "Wed", appointments: 15 }, { day: "Thu", appointments: 22 },
  { day: "Fri", appointments: 19 }, { day: "Sat", appointments: 8 },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning ☀️";
  if (h < 17) return "Good Afternoon 👋";
  return "Good Evening 🌙";
}

function formatDateLong() {
  return new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function StatCard({ icon: Icon, label, value, trend, color, isLoading }: {
  icon: React.ElementType; label: string; value: number | undefined; trend: string; color: string; isLoading: boolean;
}) {
  return (
    <motion.div variants={item}>
      <Card className="relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <Badge variant="secondary" className="text-[10px] font-semibold">{trend}</Badge>
          </div>
          {isLoading ? (
            <Skeleton className="h-9 w-20 mb-1" />
          ) : (
            <div className="text-3xl font-extrabold tracking-tight">{value ?? 0}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </CardContent>
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${color.replace("bg-", "bg-").replace("/10", "")}`} />
      </Card>
    </motion.div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: recent, isLoading: recentLoading } = useRecentAppointments();
  const { data: user, isLoading: userLoading } = useUser();
  const isAdmin = user?.email?.toLowerCase() === "admin@gmail.com";

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{getGreeting()}</h1>
            <p className="text-sm text-muted-foreground">Here&apos;s your clinic overview for today.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground border rounded-lg px-3 py-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formatDateLong()}
            </div>
            <Button size="sm" asChild>
              <Link href="/register"><UserPlus className="w-3.5 h-3.5 mr-1.5" />New Patient</Link>
            </Button>
          </div>
        </div>

        {/* Stats Bento Grid */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" variants={container} initial="hidden" animate="show">
          <StatCard icon={Users} label="Total Patients" value={stats?.totalPatients} trend="↑ Active" color="bg-primary/10 text-primary" isLoading={statsLoading} />
          <StatCard icon={CalendarCheck} label="Today's Appointments" value={stats?.todayAppointments} trend="Today" color="bg-blue-500/10 text-blue-500" isLoading={statsLoading} />
          <StatCard icon={AlertCircle} label="Critical Cases" value={stats?.criticalCases} trend="Urgent" color="bg-destructive/10 text-destructive" isLoading={statsLoading} />
          <StatCard icon={HeartPulse} label="Available Doctors" value={stats?.availableDoctors} trend="Online" color="bg-amber-500/10 text-amber-500" isLoading={statsLoading} />
        </motion.div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-base font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: "/register", icon: UserPlus, label: "Register Patient", sub: "New patient intake", color: "text-primary", showFor: "user" },
              { href: "/my-appointments", icon: CalendarDays, label: "Your Appointments", sub: "Manage visits", color: "text-blue-500", showFor: "user" },
              { href: "/queue", icon: ClipboardList, label: "View Queue", sub: "Priority appointments", color: "text-teal-500", showFor: "admin" },
              { href: "/doctors", icon: Stethoscope, label: "Manage Doctors", sub: "Leaves & availability", color: "text-amber-500", showFor: "admin" },
            ].filter(a => a.showFor === "both" || (isAdmin && a.showFor === "admin") || (!isAdmin && a.showFor === "user")).map((a) => (
              <Link key={a.href} href={a.href}>
                <Card className="hover:shadow-sm hover:border-primary/20 transition-all duration-200 cursor-pointer group h-full">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center ${a.color} group-hover:scale-105 transition-transform`}>
                      <a.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{a.label}</p>
                      <p className="text-[11px] text-muted-foreground">{a.sub}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Dashboard Grid: Chart + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Weekly Appointments</CardTitle>
                <Badge variant="secondary" className="text-[10px]"><TrendingUp className="w-3 h-3 mr-1" />+12%</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} />
                  <Area type="monotone" dataKey="appointments" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorAppts)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Activity</CardTitle>
                <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3"><Skeleton className="w-2 h-2 rounded-full mt-1.5" /><div className="flex-1 space-y-1"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-2 w-1/2" /></div></div>
                ))
              ) : (recent ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No recent activity</p>
              ) : (
                (recent ?? []).slice(0, 5).map((a, i) => (
                  <motion.div key={a.id} className="flex gap-3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.25 }}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.severity === "critical" ? "bg-destructive shadow-[0_0_6px_rgba(239,68,68,0.4)]" : "bg-primary shadow-[0_0_6px_rgba(20,184,166,0.4)]"}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{a.patient_name} → {a.doctor_name}</p>
                      <p className="text-[10px] text-muted-foreground">{a.hospital_name} · {timeAgo(a.created_at)}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] uppercase tracking-wider">Patient</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Doctor</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Hospital</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Date</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Time</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => (<TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>))}</TableRow>
                  ))
                ) : (recent ?? []).length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8 text-sm">No appointments yet</TableCell></TableRow>
                ) : (
                  (recent ?? []).map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium text-sm">{a.patient_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.doctor_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.hospital_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(a.appointment_date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.time_slot}</TableCell>
                      <TableCell><Badge variant={a.severity === "critical" ? "destructive" : "secondary"} className="text-[10px]">{a.severity}</Badge></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

"use client";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyAppointments } from "@/lib/queries";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, User, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TN_HOSPITALS } from "@/lib/hospital-data";

export default function YourAppointmentsPage() {
  const { data: appointments, isLoading, error } = useMyAppointments();

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Your Appointments</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage and track your upcoming and past clinic visits.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="py-12 text-center text-destructive text-sm font-medium">
              ⚠️ Please login to view your appointments.
            </CardContent>
          </Card>
        ) : !appointments || appointments.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">No appointments found.</p>
              <p className="text-xs text-muted-foreground/70">You haven't booked any appointments yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {appointments.map((a, i) => (
              <motion.div 
                key={a.id} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow hover:border-primary/50 relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-1 h-full ${a.severity === "critical" ? "bg-destructive" : "bg-primary"}`} />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge variant={a.status === "confirmed" ? "default" : "secondary"} className="mb-2">
                          {a.status}
                        </Badge>
                        <h3 className="font-semibold text-lg line-clamp-1">{a.doctor_name}</h3>
                        <p className="text-xs text-muted-foreground">{a.specialty || "General Checkup"}</p>
                      </div>
                      <Badge variant={a.severity === "critical" ? "destructive" : "outline"} className="text-[10px] uppercase">
                        {a.severity}
                      </Badge>
                    </div>

                    <div className="space-y-3 mt-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-primary/70" />
                        <span>{new Date(a.appointment_date + "T00:00:00").toLocaleDateString("en-IN", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary/70" />
                        <span>{a.time_slot}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary/70" />
                        <span className="line-clamp-1">{a.hospital_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4 text-primary/70" />
                        <span className="line-clamp-1">Patient: {a.patient_name}</span>
                      </div>
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-border">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 text-xs sm:text-sm"
                        onClick={() => {
                          const hospital = TN_HOSPITALS.find(h => h.name === a.hospital_name || h.id === a.hospital_id);
                          if (hospital) {
                            // Use Google Maps directions with precise coordinates
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`, '_blank');
                          } else {
                            // Fallback to name search
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(a.hospital_name + " Hospital")}`, '_blank');
                          }
                        }}
                      >
                        <Navigation className="w-4 h-4" />
                        Navigate to Hospital
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

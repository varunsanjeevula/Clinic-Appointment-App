"use client";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRegisterPatient, useHospitals } from "@/lib/queries";
import { useBookingState } from "@/lib/booking-context";
import { ScanSearch, Loader2, AlertTriangle, CheckCircle2, Star, MailCheck } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Patient, TriageResult, Hospital } from "@/lib/types";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientRegistrationSchema, type PatientRegistrationInput } from "@/lib/validations/patient";

export default function RegisterPage() {
  const [step, setStep] = useState<"form" | "email-sent" | "triage">("form");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const registerMutation = useRegisterPatient();
  const { data: hospitals } = useHospitals();
  const bookingState = useBookingState();

  const { register, handleSubmit, formState: { errors } } = useForm<PatientRegistrationInput>({
    resolver: zodResolver(patientRegistrationSchema),
  });

  async function onSubmit(data: PatientRegistrationInput) {
    const result = await registerMutation.mutateAsync(data);
    const p = (result as { patient: Patient }).patient;
    const t = (result as { triage: TriageResult }).triage;
    setPatient(p);
    setTriage(t);
    bookingState.setPatient(p);
    bookingState.setTriage(t);
    setStep("email-sent");
  }

  const recommended = hospitals?.filter(h => h.specialties.some(s => triage?.suggestedSpecialties.includes(s)))
    .sort((a, b) => {
      const am = a.specialties.filter(s => triage!.suggestedSpecialties.includes(s)).length;
      const bm = b.specialties.filter(s => triage!.suggestedSpecialties.includes(s)).length;
      return bm - am || b.rating - a.rating;
    }) ?? [];

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Register Patient</h1>
          <p className="text-sm text-muted-foreground">Enter patient details for smart server-side triage.</p>
        </div>

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name *</Label>
                        <Input id="full_name" placeholder="e.g. Rajesh Kumar" {...register("full_name")} />
                        {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="e.g. rajesh@example.com" {...register("email")} />
                        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact_number">Contact Number *</Label>
                        <Input id="contact_number" placeholder="e.g. +91 98765 43210" {...register("contact_number")} />
                        {errors.contact_number && <p className="text-xs text-destructive">{errors.contact_number.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth *</Label>
                        <Input id="dob" type="date" {...register("dob")} />
                        {errors.dob && <p className="text-xs text-destructive">{errors.dob.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender *</Label>
                        <select
                          id="gender"
                          className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          {...register("gender")}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="text-xs text-destructive">{errors.gender.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input id="address" placeholder="e.g. 123 Main Street, City" {...register("address")} />
                        {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
                      </div>
                    </div>

                    {/* Medical Info */}
                    <div className="space-y-2">
                      <Label htmlFor="symptoms">Describe Symptoms *</Label>
                      <Textarea id="symptoms" placeholder='e.g. "severe chest pain, difficulty breathing, dizziness"' rows={3} {...register("symptoms")} />
                      <p className="text-[11px] text-muted-foreground">💡 Be descriptive — our engine scans for keywords like &quot;chest pain&quot;, &quot;fever&quot;, &quot;fracture&quot;, etc.</p>
                      {errors.symptoms && <p className="text-xs text-destructive">{errors.symptoms.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="allergies">Known Allergies (Optional)</Label>
                        <Input id="allergies" placeholder="e.g. Penicillin, Peanuts" {...register("allergies")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chronic_conditions">Chronic Conditions (Optional)</Label>
                        <Input id="chronic_conditions" placeholder="e.g. Diabetes, Hypertension" {...register("chronic_conditions")} />
                      </div>
                    </div>

                    <Button type="submit" disabled={registerMutation.isPending} className="w-full sm:w-auto active:scale-[0.98] transition-transform">
                      {registerMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : <><ScanSearch className="w-4 h-4 mr-2" />Analyze & Register</>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === "email-sent" && (
            <motion.div key="email-sent" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
              <Card className="max-w-lg mx-auto overflow-hidden">
                <div className="h-2 w-full bg-gradient-to-r from-teal-400 to-primary"></div>
                <CardContent className="py-12 text-center space-y-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
                    <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MailCheck className="w-10 h-10 text-primary" />
                    </div>
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Registration Complete!</h2>
                    <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">
                      We&apos;ve sent a triage summary and tracking link to <strong>{patient?.email}</strong>.
                    </p>
                  </div>
                  <Button onClick={() => setStep("triage")} className="w-full sm:w-auto">
                    View Triage Results & Book →
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === "triage" && (
            <motion.div key="triage" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
              {/* Severity Card */}
              <Card className={triage?.severity === "critical" ? "border-destructive/30 bg-destructive/5" : "border-primary/30 bg-primary/5"}>
                <CardContent className="p-8">
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-center mb-6">
                    {triage?.severity === "critical" ? (
                      <><AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-3" /><h2 className="text-xl font-bold text-destructive mb-1">CRITICAL — Urgent Attention Required</h2></>
                    ) : (
                      <><CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" /><h2 className="text-xl font-bold text-primary mb-1">NORMAL — Non-Urgent</h2></>
                    )}
                  </motion.div>

                  <div className="space-y-4 text-left bg-background/50 p-4 rounded-xl border border-border/50">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Reported Symptoms</h3>
                      <p className="text-sm italic border-l-2 border-muted-foreground/30 pl-3 py-1">
                        &quot;{patient?.symptoms}&quot;
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-1 flex items-center gap-1">
                        <Star className="w-3 h-3" /> Gemini AI Analysis
                      </h3>
                      <p className="text-sm font-medium leading-relaxed">
                        {triage?.recommendation}
                      </p>
                    </div>

                    {(triage?.matchedCritical.length ?? 0) > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Flagged Terms</h3>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {triage?.matchedCritical.map(s => <Badge key={s} variant="destructive" className="text-[10px]">{s}</Badge>)}
                          {triage?.matchedNormal.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Specialties */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Suggested Specialties</h3>
                <div className="flex flex-wrap gap-1.5">
                  {triage?.suggestedSpecialties.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                </div>
              </div>

              {/* Hospitals */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Recommended Hospitals</h3>
                <div className="grid grid-cols-1 gap-3">
                  {recommended.map((h, i) => (
                    <motion.div key={h.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <HospitalCard hospital={h} triage={triage!} patient={patient!} />
                    </motion.div>
                  ))}
                </div>
              </div>

              <Button variant="outline" onClick={() => { setStep("form"); setTriage(null); setPatient(null); }}>
                ← Register Another Patient
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}

function HospitalCard({ hospital: h, triage }: { hospital: Hospital; triage: TriageResult; patient: Patient }) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{h.type === "hospital" ? "🏥" : "🏪"}</span>
              <h4 className="font-semibold text-sm">{h.name}</h4>
              {h.has_emergency && <Badge variant="destructive" className="text-[9px]">🚑 ER</Badge>}
            </div>
            <p className="text-[11px] text-muted-foreground mb-2">📍 {h.address}</p>
            <div className="flex flex-wrap gap-1">
              {h.specialties.map(s => (
                <Badge key={s} variant={triage.suggestedSpecialties.includes(s) ? "default" : "outline"} className="text-[9px]">{s}</Badge>
              ))}
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <div className="flex items-center gap-1 text-amber-500 text-xs mb-2">
              <Star className="w-3 h-3 fill-current" />{h.rating}
            </div>
            <Button size="sm" asChild>
              <Link href={`/book?hospital=${h.id}`}>Book →</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

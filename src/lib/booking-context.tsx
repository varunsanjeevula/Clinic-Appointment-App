"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Patient, TriageResult } from "@/lib/types";

interface BookingState {
  patient: Patient | null;
  triage: TriageResult | null;
  setPatient: (p: Patient | null) => void;
  setTriage: (t: TriageResult | null) => void;
  clear: () => void;
}

const BookingContext = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [triage, setTriage] = useState<TriageResult | null>(null);

  function clear() {
    setPatient(null);
    setTriage(null);
  }

  return (
    <BookingContext.Provider value={{ patient, triage, setPatient, setTriage, clear }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingState() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookingState must be used within BookingProvider");
  return ctx;
}

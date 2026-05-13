import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DashboardStats, Appointment, Hospital, Doctor, DoctorLeave, User } from "./types";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export function useStats() {
  return useQuery<DashboardStats>({ queryKey: ["stats"], queryFn: () => fetchJson("/api/stats") });
}

export function useRecentAppointments() {
  return useQuery<Appointment[]>({ queryKey: ["appointments", "recent"], queryFn: () => fetchJson("/api/appointments/recent") });
}

export function useAppointmentQueue() {
  return useQuery<Appointment[]>({ queryKey: ["appointments", "queue"], queryFn: () => fetchJson("/api/appointments") });
}

export function useMyAppointments() {
  return useQuery<Appointment[]>({ queryKey: ["appointments", "me"], queryFn: () => fetchJson("/api/appointments/me") });
}

export function useUser() {
  return useQuery<User>({ queryKey: ["user"], queryFn: () => fetchJson("/api/auth/me"), retry: false });
}

export function useHospitals(filters?: { district?: string; lat?: number; lng?: number; specialty?: string }) {
  const params = new URLSearchParams();
  if (filters?.district) params.set("district", filters.district);
  if (filters?.lat != null && filters?.lng != null) {
    params.set("lat", String(filters.lat));
    params.set("lng", String(filters.lng));
  }
  if (filters?.specialty) params.set("specialty", filters.specialty);
  const qs = params.toString();
  const url = qs ? `/api/hospitals?${qs}` : "/api/hospitals";
  return useQuery<Hospital[]>({ queryKey: ["hospitals", qs], queryFn: () => fetchJson(url) });
}

export function useDistricts() {
  return useQuery<{ districts: string[] }>({ queryKey: ["districts"], queryFn: () => fetch("/api/hospitals", { method: "POST" }).then(r => r.json()) });
}

export function useDoctors(hospitalId?: string) {
  const url = hospitalId ? `/api/doctors?hospital_id=${hospitalId}` : "/api/doctors";
  return useQuery<Doctor[]>({ queryKey: ["doctors", hospitalId ?? "all"], queryFn: () => fetchJson(url) });
}

export function useDoctorLeaves(doctorId: string) {
  return useQuery<DoctorLeave[]>({ queryKey: ["leaves", doctorId], queryFn: () => fetchJson(`/api/doctors/${doctorId}/leaves`), enabled: !!doctorId });
}

export function useBookedSlots(doctorId: string, date: string) {
  return useQuery<string[]>({ queryKey: ["slots", doctorId, date], queryFn: () => fetchJson(`/api/slots?doctor_id=${doctorId}&date=${date}`), enabled: !!doctorId && !!date });
}

export function useRegisterPatient() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: Record<string, string>) => postJson("/api/patients", data), onSuccess: () => { qc.invalidateQueries({ queryKey: ["stats"] }); } });
}

export function useBookAppointment() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: Record<string, string>) => postJson("/api/appointments", data), onSuccess: () => { qc.invalidateQueries({ queryKey: ["appointments"] }); qc.invalidateQueries({ queryKey: ["stats"] }); qc.invalidateQueries({ queryKey: ["slots"] }); } });
}

export function useCancelAppointment() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => fetch(`/api/appointments/${id}/cancel`, { method: "PATCH" }).then(r => r.json()), onSuccess: () => { qc.invalidateQueries({ queryKey: ["appointments"] }); qc.invalidateQueries({ queryKey: ["stats"] }); } });
}

export function useRescheduleAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, new_date, new_time_slot, reason }: { id: string; new_date: string; new_time_slot: string; reason: string }) => {
      const res = await fetch(`/api/appointments/${id}/reschedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_date, new_time_slot, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reschedule failed");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      qc.invalidateQueries({ queryKey: ["slots"] });
    },
  });
}

export function useSetDoctorLeave() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ doctorId, data }: { doctorId: string; data: Record<string, string> }) => postJson(`/api/doctors/${doctorId}/leaves`, data), onSuccess: () => { qc.invalidateQueries({ queryKey: ["leaves"] }); qc.invalidateQueries({ queryKey: ["doctors"] }); } });
}

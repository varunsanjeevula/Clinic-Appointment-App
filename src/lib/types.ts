export interface Patient {
  id: string;
  full_name: string;
  email?: string;
  contact_number: string;
  dob?: string;
  gender?: string;
  address: string;
  symptoms: string;
  allergies?: string;
  chronic_conditions?: string;
  ai_recommendation?: string;
  severity: "critical" | "normal";
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}


export interface Hospital {
  id: string;
  name: string;
  address: string;
  type: "hospital" | "clinic";
  specialties: string[];
  rating: number;
  has_emergency: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital_id: string;
  experience_years: number;
  rating: number;
  is_available: boolean;
  hospitals?: { name: string };
}

export interface DoctorLeave {
  id: string;
  doctor_id: string;
  leave_start: string;
  leave_end: string;
  reason: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  hospital_id: string;
  hospital_name: string;
  specialty: string;
  appointment_date: string;
  time_slot: string;
  severity: "critical" | "normal";
  status: string;
  created_at: string;
  patients?: Patient;
}

export interface TriageResult {
  severity: "critical" | "normal";
  matchedCritical: string[];
  matchedNormal: string[];
  suggestedSpecialties: string[];
  recommendation: string;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  criticalCases: number;
  availableDoctors: number;
}

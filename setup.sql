-- Clinic Appointment Management System - Supabase Setup
-- Run this in your Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  address TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('critical', 'normal')) DEFAULT 'normal',
  severity_score INTEGER DEFAULT 0,
  matched_symptoms TEXT[] DEFAULT '{}',
  suggested_specialties TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hospitals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 4.0,
  type TEXT CHECK (type IN ('hospital', 'clinic')) DEFAULT 'hospital',
  has_emergency BOOLEAN DEFAULT false,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  experience_years INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 4.0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctor_leaves (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  leave_start DATE NOT NULL,
  leave_end DATE NOT NULL,
  reason TEXT DEFAULT 'Personal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
  doctor_name TEXT NOT NULL,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  hospital_name TEXT NOT NULL,
  specialty TEXT,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('critical', 'normal')) DEFAULT 'normal',
  status TEXT CHECK (status IN ('confirmed', 'completed', 'cancelled')) DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_patients" ON patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_hospitals" ON hospitals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_doctors" ON doctors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_leaves" ON doctor_leaves FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE doctors;
ALTER PUBLICATION supabase_realtime ADD TABLE doctor_leaves;

INSERT INTO hospitals (name, address, specialties, rating, type, has_emergency, phone) VALUES
('City General Hospital','123 Main St, Downtown',ARRAY['Emergency Medicine','Cardiology','Neurology','Orthopedics','General Surgery'],4.5,'hospital',true,'+91 98765 43210'),
('MedCare Family Clinic','456 Oak Ave, Suburb',ARRAY['General Medicine','Dermatology','ENT','Pediatrics'],4.2,'clinic',false,'+91 98765 43211'),
('HeartCare Specialty Hospital','789 Cardiac Lane, Medical Hub',ARRAY['Cardiology','Cardiac Surgery','Vascular Surgery'],4.8,'hospital',true,'+91 98765 43212'),
('NeuroLife Medical Center','321 Brain Blvd, Healthcare Park',ARRAY['Neurology','Psychiatry','Neurosurgery'],4.6,'hospital',true,'+91 98765 43213'),
('OrthoPlex Bone & Joint Hospital','654 Spine Rd, East Wing',ARRAY['Orthopedics','Sports Medicine','Physiotherapy'],4.4,'hospital',false,'+91 98765 43214'),
('WellBeing Family Clinic','987 Care St, Green Park',ARRAY['Pediatrics','General Medicine','Gynecology'],4.3,'clinic',false,'+91 98765 43215'),
('PrimeCare Multi-Specialty','246 Health Ave, Central',ARRAY['General Medicine','Gastroenterology','Pulmonology','Endocrinology'],4.5,'hospital',true,'+91 98765 43216'),
('SkinGlow Derma Clinic','135 Beauty Lane, West End',ARRAY['Dermatology','Cosmetic Surgery','Trichology'],4.1,'clinic',false,'+91 98765 43217');

DO $$
DECLARE h1 UUID;h2 UUID;h3 UUID;h4 UUID;h5 UUID;h6 UUID;h7 UUID;h8 UUID;
BEGIN
  SELECT id INTO h1 FROM hospitals WHERE name='City General Hospital';
  SELECT id INTO h2 FROM hospitals WHERE name='MedCare Family Clinic';
  SELECT id INTO h3 FROM hospitals WHERE name='HeartCare Specialty Hospital';
  SELECT id INTO h4 FROM hospitals WHERE name='NeuroLife Medical Center';
  SELECT id INTO h5 FROM hospitals WHERE name='OrthoPlex Bone & Joint Hospital';
  SELECT id INTO h6 FROM hospitals WHERE name='WellBeing Family Clinic';
  SELECT id INTO h7 FROM hospitals WHERE name='PrimeCare Multi-Specialty';
  SELECT id INTO h8 FROM hospitals WHERE name='SkinGlow Derma Clinic';
  INSERT INTO doctors (name,specialty,hospital_id,experience_years,rating) VALUES
  ('Dr. Rajesh Kumar','Cardiology',h1,15,4.7),
  ('Dr. Priya Sharma','Neurology',h1,12,4.5),
  ('Dr. Amit Verma','Emergency Medicine',h1,8,4.3),
  ('Dr. Anil Mehta','General Medicine',h2,20,4.4),
  ('Dr. Sneha Patel','Dermatology',h2,10,4.6),
  ('Dr. Vikram Singh','Cardiac Surgery',h3,18,4.9),
  ('Dr. Ananya Das','Cardiology',h3,14,4.7),
  ('Dr. Suresh Reddy','Neurology',h4,16,4.8),
  ('Dr. Meera Iyer','Psychiatry',h4,11,4.5),
  ('Dr. Karthik Nair','Orthopedics',h5,13,4.6),
  ('Dr. Deepa Joshi','Sports Medicine',h5,7,4.2),
  ('Dr. Rahul Gupta','Pediatrics',h6,9,4.4),
  ('Dr. Kavitha Menon','Gynecology',h6,15,4.7),
  ('Dr. Arjun Rao','Gastroenterology',h7,12,4.5),
  ('Dr. Lakshmi Venkat','Pulmonology',h7,10,4.3),
  ('Dr. Pooja Malhotra','Dermatology',h8,8,4.4);
END $$;

-- Run this file in the Supabase SQL Editor to refresh all hospitals and doctors
-- It will safely clear the existing clinic data and insert a complete, robust dataset.

-- 1. Safely remove existing data (Appointments will keep doctor_name and hospital_name as they are hardcoded text fields)
DELETE FROM doctor_leaves;
DELETE FROM doctors;
DELETE FROM hospitals;

-- 2. Insert 5 Major Comprehensive Hospitals
INSERT INTO hospitals (id, name, address, specialties, rating, type, has_emergency, phone) VALUES
('11111111-1111-1111-1111-111111111111', 'City General Hospital', '123 Main St, Downtown', ARRAY['Emergency Medicine', 'General Medicine', 'General Surgery', 'Orthopedics', 'Cardiology', 'Pediatrics'], 4.5, 'hospital', true, '+91 98765 43210'),
('22222222-2222-2222-2222-222222222222', 'Neuro & Heart Center', '789 Cardiac Lane', ARRAY['Cardiology', 'Cardiac Surgery', 'Vascular Surgery', 'Neurology', 'Neurosurgery', 'Psychiatry'], 4.8, 'hospital', true, '+91 98765 43212'),
('33333333-3333-3333-3333-333333333333', 'Global Health & Wellness', '100 Universal Blvd', ARRAY['Urology', 'Oncology', 'Nephrology', 'Ophthalmology', 'Dentistry', 'Endocrinology', 'Gastroenterology'], 4.9, 'hospital', true, '+91 99999 88888'),
('44444444-4444-4444-4444-444444444444', 'Women & Child Institute', '456 Oak Ave, Suburb', ARRAY['Gynecology', 'Pediatrics', 'Endocrinology', 'Dermatology'], 4.6, 'hospital', true, '+91 98765 43211'),
('55555555-5555-5555-5555-555555555555', 'Aesthetics & Rehab Clinic', '135 Beauty Lane', ARRAY['Dermatology', 'Cosmetic Surgery', 'Trichology', 'Orthopedics', 'Sports Medicine', 'Physiotherapy', 'ENT', 'Pulmonology'], 4.3, 'clinic', false, '+91 98765 43217');

-- 3. Insert 2 Doctors for Every Single Category (50 Doctors Total)
INSERT INTO doctors (name, specialty, hospital_id, experience_years, rating) VALUES
-- Emergency Medicine
('Dr. Amit Verma', 'Emergency Medicine', '11111111-1111-1111-1111-111111111111', 8, 4.3),
('Dr. Sarah Connor', 'Emergency Medicine', '11111111-1111-1111-1111-111111111111', 12, 4.8),

-- General Medicine
('Dr. Anil Mehta', 'General Medicine', '11111111-1111-1111-1111-111111111111', 20, 4.4),
('Dr. John Doe', 'General Medicine', '11111111-1111-1111-1111-111111111111', 15, 4.7),

-- General Surgery
('Dr. Meredith Grey', 'General Surgery', '11111111-1111-1111-1111-111111111111', 10, 4.5),
('Dr. Derek Shepherd', 'General Surgery', '11111111-1111-1111-1111-111111111111', 14, 4.7),

-- Orthopedics
('Dr. Karthik Nair', 'Orthopedics', '11111111-1111-1111-1111-111111111111', 13, 4.6),
('Dr. Robert Chang', 'Orthopedics', '55555555-5555-5555-5555-555555555555', 18, 4.8),

-- Cardiology
('Dr. Rajesh Kumar', 'Cardiology', '11111111-1111-1111-1111-111111111111', 15, 4.7),
('Dr. Ananya Das', 'Cardiology', '22222222-2222-2222-2222-222222222222', 14, 4.7),

-- Cardiac Surgery
('Dr. Vikram Singh', 'Cardiac Surgery', '22222222-2222-2222-2222-222222222222', 18, 4.9),
('Dr. Christina Yang', 'Cardiac Surgery', '22222222-2222-2222-2222-222222222222', 11, 4.6),

-- Vascular Surgery
('Dr. Leonard McCoy', 'Vascular Surgery', '22222222-2222-2222-2222-222222222222', 22, 4.8),
('Dr. Beverly Crusher', 'Vascular Surgery', '22222222-2222-2222-2222-222222222222', 16, 4.5),

-- Neurology
('Dr. Priya Sharma', 'Neurology', '22222222-2222-2222-2222-222222222222', 12, 4.5),
('Dr. Suresh Reddy', 'Neurology', '22222222-2222-2222-2222-222222222222', 16, 4.8),

-- Neurosurgery
('Dr. Stephen Strange', 'Neurosurgery', '22222222-2222-2222-2222-222222222222', 25, 4.9),
('Dr. Gregory House', 'Neurosurgery', '22222222-2222-2222-2222-222222222222', 15, 4.6),

-- Psychiatry
('Dr. Meera Iyer', 'Psychiatry', '22222222-2222-2222-2222-222222222222', 11, 4.5),
('Dr. Hannibal Lecter', 'Psychiatry', '22222222-2222-2222-2222-222222222222', 30, 4.9),

-- Urology
('Dr. Ravi Kumar', 'Urology', '33333333-3333-3333-3333-333333333333', 14, 4.6),
('Dr. Emily Stone', 'Urology', '33333333-3333-3333-3333-333333333333', 9, 4.5),

-- Oncology
('Dr. Bruce Wayne', 'Oncology', '33333333-3333-3333-3333-333333333333', 22, 4.9),
('Dr. Clark Kent', 'Oncology', '33333333-3333-3333-3333-333333333333', 18, 4.8),

-- Nephrology
('Dr. Charles Xavier', 'Nephrology', '33333333-3333-3333-3333-333333333333', 25, 4.9),
('Dr. Jean Grey', 'Nephrology', '33333333-3333-3333-3333-333333333333', 12, 4.6),

-- Ophthalmology
('Dr. Matt Murdock', 'Ophthalmology', '33333333-3333-3333-3333-333333333333', 10, 4.4),
('Dr. Peter Parker', 'Ophthalmology', '33333333-3333-3333-3333-333333333333', 5, 4.2),

-- Dentistry
('Dr. Hermione Granger', 'Dentistry', '33333333-3333-3333-3333-333333333333', 8, 4.5),
('Dr. Ron Weasley', 'Dentistry', '33333333-3333-3333-3333-333333333333', 7, 4.1),

-- Gastroenterology
('Dr. Arjun Rao', 'Gastroenterology', '33333333-3333-3333-3333-333333333333', 12, 4.5),
('Dr. Barry Allen', 'Gastroenterology', '33333333-3333-3333-3333-333333333333', 6, 4.4),

-- Gynecology
('Dr. Kavitha Menon', 'Gynecology', '44444444-4444-4444-4444-444444444444', 15, 4.7),
('Dr. Diana Prince', 'Gynecology', '44444444-4444-4444-4444-444444444444', 20, 4.9),

-- Pediatrics
('Dr. Rahul Gupta', 'Pediatrics', '44444444-4444-4444-4444-444444444444', 9, 4.4),
('Dr. Tony Stark', 'Pediatrics', '11111111-1111-1111-1111-111111111111', 15, 4.8),

-- Endocrinology
('Dr. Bruce Banner', 'Endocrinology', '44444444-4444-4444-4444-444444444444', 18, 4.8),
('Dr. Natasha Romanoff', 'Endocrinology', '33333333-3333-3333-3333-333333333333', 11, 4.5),

-- Dermatology
('Dr. Sneha Patel', 'Dermatology', '44444444-4444-4444-4444-444444444444', 10, 4.6),
('Dr. Pooja Malhotra', 'Dermatology', '55555555-5555-5555-5555-555555555555', 8, 4.4),

-- Cosmetic Surgery
('Dr. Steve Rogers', 'Cosmetic Surgery', '55555555-5555-5555-5555-555555555555', 14, 4.6),
('Dr. Wade Wilson', 'Cosmetic Surgery', '55555555-5555-5555-5555-555555555555', 9, 4.2),

-- Trichology
('Dr. Arthur Curry', 'Trichology', '55555555-5555-5555-5555-555555555555', 12, 4.4),
('Dr. Victor Stone', 'Trichology', '55555555-5555-5555-5555-555555555555', 7, 4.1),

-- Sports Medicine
('Dr. Deepa Joshi', 'Sports Medicine', '55555555-5555-5555-5555-555555555555', 7, 4.2),
('Dr. Oliver Queen', 'Sports Medicine', '55555555-5555-5555-5555-555555555555', 11, 4.6),

-- Physiotherapy
('Dr. Clint Barton', 'Physiotherapy', '55555555-5555-5555-5555-555555555555', 15, 4.7),
('Dr. Scott Lang', 'Physiotherapy', '55555555-5555-5555-5555-555555555555', 6, 4.3),

-- ENT
('Dr. Sam Wilson', 'ENT', '55555555-5555-5555-5555-555555555555', 9, 4.4),
('Dr. Bucky Barnes', 'ENT', '55555555-5555-5555-5555-555555555555', 13, 4.5),

-- Pulmonology
('Dr. Lakshmi Venkat', 'Pulmonology', '55555555-5555-5555-5555-555555555555', 10, 4.3),
('Dr. TChalla', 'Pulmonology', '55555555-5555-5555-5555-555555555555', 16, 4.8);

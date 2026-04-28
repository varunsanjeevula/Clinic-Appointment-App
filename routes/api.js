// ============================================
// API Routes — RESTful endpoints for all data
// ============================================

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const symptomAnalyzer = require('../services/symptomAnalyzer');

// ── Dashboard Stats ────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [patientsRes, appointmentsRes, doctorsRes] = await Promise.all([
      supabase.from('patients').select('id', { count: 'exact', head: true }),
      supabase.from('appointments').select('*'),
      supabase.from('doctors').select('id, is_available')
    ]);

    const appointments = appointmentsRes.data || [];
    const doctors = doctorsRes.data || [];
    const today = new Date().toISOString().split('T')[0];

    res.json({
      totalPatients: patientsRes.count || 0,
      todayAppointments: appointments.filter(a => a.appointment_date === today && a.status === 'confirmed').length,
      criticalCases: appointments.filter(a => a.severity === 'critical' && a.status === 'confirmed').length,
      availableDoctors: doctors.filter(d => d.is_available).length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Recent Appointments ────────────────────
router.get('/appointments/recent', async (req, res) => {
  try {
    const { data, error } = await supabase.from('appointments')
      .select('*').order('created_at', { ascending: false }).limit(8);
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Appointment Queue (priority ordered) ───
router.get('/appointments/queue', async (req, res) => {
  try {
    const { data, error } = await supabase.from('appointments')
      .select('*').eq('status', 'confirmed')
      .order('severity', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Book Appointment ───────────────────────
router.post('/appointments', async (req, res) => {
  try {
    const { patient_id, patient_name, doctor_id, doctor_name, hospital_id,
            hospital_name, specialty, appointment_date, time_slot, severity } = req.body;

    // Check if slot already booked
    const { data: existing } = await supabase.from('appointments')
      .select('id').eq('doctor_id', doctor_id)
      .eq('appointment_date', appointment_date)
      .eq('time_slot', time_slot).eq('status', 'confirmed');

    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    const { data, error } = await supabase.from('appointments').insert({
      patient_id, patient_name, doctor_id, doctor_name, hospital_id,
      hospital_name, specialty, appointment_date, time_slot, severity
    }).select().single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Cancel Appointment ─────────────────────
router.patch('/appointments/:id/cancel', async (req, res) => {
  try {
    const { data, error } = await supabase.from('appointments')
      .update({ status: 'cancelled' }).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Register Patient + Triage ──────────────
router.post('/patients', async (req, res) => {
  try {
    const { full_name, contact_number, address, symptoms } = req.body;

    if (!full_name || !contact_number || !address || !symptoms) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Run triage on server
    const triage = symptomAnalyzer.analyze(symptoms);

    const { data, error } = await supabase.from('patients').insert({
      full_name, contact_number, address, symptoms,
      severity: triage.severity,
      severity_score: triage.score,
      matched_symptoms: triage.matchedSymptoms,
      suggested_specialties: triage.suggestedSpecialties
    }).select().single();

    if (error) throw error;

    res.status(201).json({ patient: data, triage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get All Hospitals ──────────────────────
router.get('/hospitals', async (req, res) => {
  try {
    const { data, error } = await supabase.from('hospitals')
      .select('*').order('rating', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get Single Hospital ────────────────────
router.get('/hospitals/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('hospitals')
      .select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get Doctors (with hospital join) ───────
router.get('/doctors', async (req, res) => {
  try {
    const hospitalId = req.query.hospital_id;
    let query = supabase.from('doctors').select('*, hospitals(name, address)');
    if (hospitalId) query = query.eq('hospital_id', hospitalId);
    query = query.order('name');

    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Doctor Leaves ──────────────────────────
router.get('/doctors/:id/leaves', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.from('doctor_leaves')
      .select('*').eq('doctor_id', req.params.id)
      .gte('leave_end', today).order('leave_start');
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Check if doctor on leave for a date ────
router.get('/doctors/:id/on-leave', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date query param required' });

    const { data, error } = await supabase.from('doctor_leaves')
      .select('*').eq('doctor_id', req.params.id)
      .lte('leave_start', date).gte('leave_end', date);
    if (error) throw error;
    res.json({ onLeave: data && data.length > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Set Doctor Leave ───────────────────────
router.post('/doctors/:id/leaves', async (req, res) => {
  try {
    const { leave_start, leave_end, reason } = req.body;
    const doctorId = req.params.id;

    if (!leave_start || !leave_end) {
      return res.status(400).json({ error: 'Start and end dates are required' });
    }

    const { data, error } = await supabase.from('doctor_leaves').insert({
      doctor_id: doctorId, leave_start, leave_end, reason: reason || 'Personal'
    }).select().single();
    if (error) throw error;

    // Mark doctor unavailable
    await supabase.from('doctors').update({ is_available: false }).eq('id', doctorId);

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get Booked Slots ───────────────────────
router.get('/slots/booked', async (req, res) => {
  try {
    const { doctor_id, date } = req.query;
    if (!doctor_id || !date) return res.status(400).json({ error: 'doctor_id and date required' });

    const { data, error } = await supabase.from('appointments')
      .select('time_slot').eq('doctor_id', doctor_id)
      .eq('appointment_date', date).eq('status', 'confirmed');
    if (error) throw error;
    res.json((data || []).map(b => b.time_slot));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

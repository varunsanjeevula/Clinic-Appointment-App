// ============================================
// API Client — Communicates with Express server
// Replaces direct Supabase calls
// ============================================

const API = {
  base: '/api',

  async request(url, options = {}) {
    try {
      const res = await fetch(this.base + url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (err) {
      console.error(`API Error [${url}]:`, err);
      throw err;
    }
  },

  // Dashboard
  getStats() {
    return this.request('/stats');
  },

  getRecentAppointments() {
    return this.request('/appointments/recent');
  },

  // Patients
  registerPatient(patientData) {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData)
    });
  },

  // Hospitals
  getHospitals() {
    return this.request('/hospitals');
  },

  getHospital(id) {
    return this.request(`/hospitals/${id}`);
  },

  // Doctors
  getDoctors(hospitalId = null) {
    const query = hospitalId ? `?hospital_id=${hospitalId}` : '';
    return this.request(`/doctors${query}`);
  },

  getDoctorLeaves(doctorId) {
    return this.request(`/doctors/${doctorId}/leaves`);
  },

  isDoctorOnLeave(doctorId, date) {
    return this.request(`/doctors/${doctorId}/on-leave?date=${date}`);
  },

  setDoctorLeave(doctorId, leaveData) {
    return this.request(`/doctors/${doctorId}/leaves`, {
      method: 'POST',
      body: JSON.stringify(leaveData)
    });
  },

  // Appointments
  getAppointmentQueue() {
    return this.request('/appointments/queue');
  },

  bookAppointment(appointmentData) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });
  },

  cancelAppointment(id) {
    return this.request(`/appointments/${id}/cancel`, { method: 'PATCH' });
  },

  // Slots
  getBookedSlots(doctorId, date) {
    return this.request(`/slots/booked?doctor_id=${doctorId}&date=${date}`);
  }
};

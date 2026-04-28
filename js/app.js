// Main Application Controller
const App = {
  currentPage: 'dashboard',
  currentPatient: null,
  triageResult: null,
  selectedHospital: null,
  selectedDoctor: null,
  selectedDate: null,
  selectedSlot: null,

  init() {
    this.setupNavigation();
    this.setupModalClose();
    this.navigateTo(window.location.hash.slice(1) || 'dashboard');
    this.setupRealtime();
  },

  setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo(item.dataset.page);
      });
    });
  },

  setupModalClose() {
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'modalOverlay') Utils.closeModal();
    });
    document.getElementById('modalCloseBtn').addEventListener('click', () => Utils.closeModal());
  },

  navigateTo(page) {
    if (!page) page = 'dashboard';
    this.currentPage = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const pageEl = document.getElementById(`page-${page}`);
    if (pageEl) pageEl.classList.add('active');
    document.querySelectorAll(`.nav-item[data-page="${page}"]`).forEach(n => n.classList.add('active'));
    window.location.hash = page;
    // Load page data
    switch(page) {
      case 'dashboard': this.loadDashboard(); break;
      case 'register': break;
      case 'queue': QueueManager.load(); break;
      case 'doctors': DoctorManagement.load(); break;
    }
  },

  async loadDashboard() {
    try {
      const [patients, appointments, doctors] = await Promise.all([
        DB.getAll('patients'), DB.getAll('appointments'), DB.getAll('doctors')
      ]);
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appointments.filter(a => a.appointment_date === today && a.status === 'confirmed');
      const criticalCount = appointments.filter(a => a.severity === 'critical' && a.status === 'confirmed').length;
      const availableDocs = doctors.filter(d => d.is_available).length;

      document.getElementById('statPatients').textContent = patients.length;
      document.getElementById('statToday').textContent = todayAppts.length;
      document.getElementById('statCritical').textContent = criticalCount;
      document.getElementById('statDoctors').textContent = availableDocs;

      // Recent appointments
      const recent = appointments.slice(0, 8);
      const tbody = document.getElementById('recentBody');
      if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No appointments yet</td></tr>';
        return;
      }
      tbody.innerHTML = recent.map(a => `
        <tr>
          <td><div class="patient-cell"><div class="avatar" style="background:${Utils.getAvatarColor(a.patient_name)}">${Utils.getInitials(a.patient_name)}</div><span>${Utils.sanitize(a.patient_name)}</span></div></td>
          <td>${Utils.sanitize(a.doctor_name)}</td>
          <td>${Utils.sanitize(a.hospital_name)}</td>
          <td>${Utils.formatDate(a.appointment_date)}</td>
          <td>${a.time_slot}</td>
          <td><span class="badge badge-${a.severity}">${a.severity}</span></td>
        </tr>
      `).join('');
    } catch(err) { console.error('Dashboard error:', err); }
  },

  setupRealtime() {
    DB.subscribeToTable('appointments', () => {
      if (this.currentPage === 'dashboard') this.loadDashboard();
      if (this.currentPage === 'queue') QueueManager.load();
    });
    DB.subscribeToTable('doctors', () => {
      if (this.currentPage === 'doctors') DoctorManagement.load();
    });
  }
};

// Patient Registration
const Registration = {
  init() {
    document.getElementById('registerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  },

  async handleSubmit() {
    const name = document.getElementById('patientName').value.trim();
    const phone = document.getElementById('patientPhone').value.trim();
    const address = document.getElementById('patientAddress').value.trim();
    const symptoms = document.getElementById('patientSymptoms').value.trim();

    if (!name || !phone || !address || !symptoms) {
      Utils.showToast('Please fill in all fields', 'error');
      return;
    }
    if (!Utils.isValidPhone(phone)) {
      Utils.showToast('Please enter a valid phone number', 'error');
      return;
    }

    const triage = SymptomAnalyzer.analyze(symptoms);

    try {
      const patient = await DB.insert('patients', {
        full_name: name, contact_number: phone, address: address, symptoms: symptoms,
        severity: triage.severity, severity_score: triage.score,
        matched_symptoms: triage.matchedSymptoms, suggested_specialties: triage.suggestedSpecialties
      });

      App.currentPatient = patient;
      App.triageResult = triage;
      Utils.showToast('Patient registered successfully!', 'success');
      document.getElementById('registerForm').reset();
      this.showTriageResults(patient, triage);
    } catch(err) {
      Utils.showToast('Registration failed: ' + err.message, 'error');
    }
  },

  async showTriageResults(patient, triage) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-triage').classList.add('active');

    const severityHTML = triage.severity === 'critical'
      ? `<div class="severity-display critical animate-scale">
           <div class="severity-icon">🚨</div>
           <h2 class="severity-title">CRITICAL — Urgent Attention Required</h2>
           <p class="severity-desc">${triage.recommendation}</p>
           <div class="matched-symptoms">${triage.matchedCritical.map(s => `<span class="symptom-chip critical">${s}</span>`).join('')}${triage.matchedNormal.map(s => `<span class="symptom-chip normal">${s}</span>`).join('')}</div>
         </div>`
      : `<div class="severity-display normal animate-scale">
           <div class="severity-icon">✅</div>
           <h2 class="severity-title">NORMAL — Non-Urgent</h2>
           <p class="severity-desc">${triage.recommendation}</p>
           <div class="matched-symptoms">${triage.matchedNormal.map(s => `<span class="symptom-chip normal">${s}</span>`).join('')}</div>
         </div>`;

    document.getElementById('triageResultArea').innerHTML = severityHTML;

    // Show specialties
    document.getElementById('suggestedSpecialties').innerHTML =
      triage.suggestedSpecialties.map(s => `<span class="tag tag-specialty">${s}</span>`).join(' ');

    // Load recommended hospitals
    const hospitals = await DB.getAll('hospitals', 'rating', false);
    const recommended = hospitals.filter(h =>
      h.specialties.some(s => triage.suggestedSpecialties.includes(s))
    ).sort((a, b) => {
      const aMatch = a.specialties.filter(s => triage.suggestedSpecialties.includes(s)).length;
      const bMatch = b.specialties.filter(s => triage.suggestedSpecialties.includes(s)).length;
      if (triage.severity === 'critical') {
        if (b.has_emergency !== a.has_emergency) return b.has_emergency ? 1 : -1;
      }
      return bMatch - aMatch || b.rating - a.rating;
    });

    const container = document.getElementById('hospitalRecommendations');
    if (recommended.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No matching hospitals found. Showing all hospitals.</p></div>';
      return;
    }

    container.innerHTML = recommended.map(h => `
      <div class="glass-card hospital-card animate-fade">
        <div class="hospital-card-header">
          <div class="hospital-icon ${h.type === 'hospital' ? 'hospital-type' : 'clinic-type'}">${h.type === 'hospital' ? '🏥' : '🏪'}</div>
          <div>
            <h3 class="hospital-name">${Utils.sanitize(h.name)}</h3>
            <p class="hospital-address">📍 ${Utils.sanitize(h.address)}</p>
          </div>
        </div>
        <div class="hospital-specialties">
          ${h.specialties.map(s => `<span class="tag ${triage.suggestedSpecialties.includes(s) ? '' : 'tag-specialty'}">${s}</span>`).join('')}
        </div>
        <div class="hospital-meta">
          <div>${Utils.renderStars(h.rating)} ${h.has_emergency ? '<span class="emergency-badge">🚑 Emergency</span>' : ''}</div>
          <button class="btn btn-primary btn-sm" onclick="BookingManager.startBooking('${h.id}')">Book Here →</button>
        </div>
      </div>
    `).join('');
  }
};

// Booking Manager
const BookingManager = {
  doctors: [],
  bookedSlots: [],

  async startBooking(hospitalId) {
    const hospital = await DB.getById('hospitals', hospitalId);
    if (!hospital) { Utils.showToast('Hospital not found', 'error'); return; }
    App.selectedHospital = hospital;
    App.selectedDoctor = null;
    App.selectedDate = null;
    App.selectedSlot = null;

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-booking').classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById('bookingHospitalName').textContent = hospital.name;
    this.updateSteps(1);
    await this.loadDoctors(hospitalId);
  },

  updateSteps(step) {
    document.querySelectorAll('.step').forEach((s, i) => {
      s.classList.remove('active', 'completed');
      if (i + 1 < step) s.classList.add('completed');
      if (i + 1 === step) s.classList.add('active');
    });
  },

  async loadDoctors(hospitalId) {
    const allDoctors = await DB.getWhere('doctors', 'hospital_id', hospitalId);
    const specialties = App.triageResult ? App.triageResult.suggestedSpecialties : [];
    // Sort: matching specialty first
    this.doctors = allDoctors.sort((a, b) => {
      const aMatch = specialties.includes(a.specialty) ? 1 : 0;
      const bMatch = specialties.includes(b.specialty) ? 1 : 0;
      return bMatch - aMatch;
    });

    const container = document.getElementById('doctorsList');
    if (this.doctors.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">👨‍⚕️</div><p class="empty-state-title">No doctors available at this hospital</p></div>';
      return;
    }

    // Check leaves for each doctor
    const doctorCards = [];
    for (const doc of this.doctors) {
      const leaves = await DB.getDoctorLeaves(doc.id);
      const hasActiveLeave = leaves.length > 0;
      const isMatch = specialties.includes(doc.specialty);
      const leaveHTML = hasActiveLeave
        ? `<div class="leave-notice">⚠️ On leave: ${Utils.formatDate(leaves[0].leave_start)} — ${Utils.formatDate(leaves[0].leave_end)} (${leaves[0].reason})</div>` : '';

      doctorCards.push(`
        <div class="glass-card doctor-select-card ${hasActiveLeave ? 'on-leave' : ''}" data-doctor-id="${doc.id}" onclick="${hasActiveLeave ? '' : `BookingManager.selectDoctor('${doc.id}')`}">
          <div class="avatar doctor-avatar" style="background:${Utils.getAvatarColor(doc.name)}">${Utils.getInitials(doc.name)}</div>
          <div class="doctor-info">
            <h4>${Utils.sanitize(doc.name)} ${isMatch ? '<span class="badge badge-info">Recommended</span>' : ''}</h4>
            <p>${doc.specialty} · ${doc.experience_years} yrs exp · ${Utils.renderStars(doc.rating)}</p>
            ${hasActiveLeave ? leaveHTML : '<span style="color:var(--normal-color);font-size:12px">✓ Available</span>'}
          </div>
        </div>
      `);
    }
    container.innerHTML = doctorCards.join('');
  },

  selectDoctor(doctorId) {
    const doc = this.doctors.find(d => d.id === doctorId);
    if (!doc) return;
    App.selectedDoctor = doc;

    document.querySelectorAll('.doctor-select-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`[data-doctor-id="${doctorId}"]`).classList.add('selected');

    this.updateSteps(2);
    this.showDatePicker();
  },

  showDatePicker() {
    const days = Utils.getNextDays(7);
    document.getElementById('datePickerArea').innerHTML = `
      <h3 style="margin-bottom:var(--space-md);font-size:var(--text-lg)">Select Date</h3>
      <div class="date-grid">${days.map(d => `
        <button class="date-btn" data-date="${d.date}" onclick="BookingManager.selectDate('${d.date}')">
          <div class="date-day">${d.day}</div>
          <div class="date-num">${d.num}</div>
          <div class="date-day">${d.month}</div>
        </button>
      `).join('')}</div>
    `;
    document.getElementById('datePickerArea').style.display = 'block';
    document.getElementById('timeSlotsArea').style.display = 'none';
    document.getElementById('confirmArea').style.display = 'none';
  },

  async selectDate(date) {
    // Check if doctor is on leave that day
    const onLeave = await DB.isDoctorOnLeave(App.selectedDoctor.id, date);
    if (onLeave) {
      Utils.showToast('The selected doctor is on leave on this date. Please choose another date.', 'warning');
      return;
    }
    App.selectedDate = date;
    document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('selected'));
    document.querySelector(`[data-date="${date}"]`).classList.add('selected');

    this.updateSteps(3);
    await this.loadTimeSlots(date);
  },

  async loadTimeSlots(date) {
    const slots = Utils.getTimeSlots();
    // Check which slots are booked
    const { data: booked } = await db.from('appointments')
      .select('time_slot').eq('doctor_id', App.selectedDoctor.id)
      .eq('appointment_date', date).eq('status', 'confirmed');
    const bookedSlots = (booked || []).map(b => b.time_slot);

    document.getElementById('timeSlotsArea').innerHTML = `
      <h3 style="margin-bottom:var(--space-md);font-size:var(--text-lg)">Select Time Slot</h3>
      <div class="slots-grid">${slots.map(s => `
        <button class="slot-btn ${bookedSlots.includes(s) ? 'booked' : ''}" 
          ${bookedSlots.includes(s) ? 'disabled' : ''} onclick="BookingManager.selectSlot('${s}')">
          ${s}
        </button>
      `).join('')}</div>
    `;
    document.getElementById('timeSlotsArea').style.display = 'block';
    document.getElementById('confirmArea').style.display = 'none';
  },

  selectSlot(slot) {
    App.selectedSlot = slot;
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
    event.target.classList.add('selected');
    this.showConfirmation();
  },

  showConfirmation() {
    document.getElementById('confirmArea').style.display = 'block';
    document.getElementById('confirmArea').innerHTML = `
      <div class="divider"></div>
      <h3 style="margin-bottom:var(--space-lg);font-size:var(--text-lg)">Confirm Appointment</h3>
      <div class="glass-card-static">
        <div class="confirmation-details">
          <div class="detail-item"><div class="detail-label">Patient</div><div class="detail-value">${Utils.sanitize(App.currentPatient.full_name)}</div></div>
          <div class="detail-item"><div class="detail-label">Severity</div><div class="detail-value"><span class="badge badge-${App.triageResult.severity}">${App.triageResult.severity}</span></div></div>
          <div class="detail-item"><div class="detail-label">Hospital</div><div class="detail-value">${Utils.sanitize(App.selectedHospital.name)}</div></div>
          <div class="detail-item"><div class="detail-label">Doctor</div><div class="detail-value">${Utils.sanitize(App.selectedDoctor.name)}</div></div>
          <div class="detail-item"><div class="detail-label">Date</div><div class="detail-value">${Utils.formatDate(App.selectedDate)}</div></div>
          <div class="detail-item"><div class="detail-label">Time</div><div class="detail-value">${App.selectedSlot}</div></div>
        </div>
        <button class="btn btn-primary btn-lg btn-block" onclick="BookingManager.confirmBooking()" id="confirmBtn">✓ Confirm Appointment</button>
      </div>
    `;
    document.getElementById('confirmArea').scrollIntoView({ behavior: 'smooth' });
  },

  async confirmBooking() {
    const btn = document.getElementById('confirmBtn');
    btn.disabled = true;
    btn.textContent = 'Booking...';

    try {
      await DB.insert('appointments', {
        patient_id: App.currentPatient.id,
        patient_name: App.currentPatient.full_name,
        doctor_id: App.selectedDoctor.id,
        doctor_name: App.selectedDoctor.name,
        hospital_id: App.selectedHospital.id,
        hospital_name: App.selectedHospital.name,
        specialty: App.selectedDoctor.specialty,
        appointment_date: App.selectedDate,
        time_slot: App.selectedSlot,
        severity: App.triageResult.severity
      });

      document.getElementById('confirmArea').innerHTML = `
        <div class="glass-card-static confirmation-card animate-scale">
          <div class="confirmation-icon">🎉</div>
          <h2 class="confirmation-title">Appointment Booked!</h2>
          <p style="color:var(--text-secondary);margin-bottom:var(--space-xl)">Your appointment has been successfully scheduled.</p>
          <div class="confirmation-details">
            <div class="detail-item"><div class="detail-label">Patient</div><div class="detail-value">${Utils.sanitize(App.currentPatient.full_name)}</div></div>
            <div class="detail-item"><div class="detail-label">Doctor</div><div class="detail-value">${Utils.sanitize(App.selectedDoctor.name)}</div></div>
            <div class="detail-item"><div class="detail-label">Date</div><div class="detail-value">${Utils.formatDate(App.selectedDate)}</div></div>
            <div class="detail-item"><div class="detail-label">Time</div><div class="detail-value">${App.selectedSlot}</div></div>
          </div>
          <div style="display:flex;gap:var(--space-md);justify-content:center;margin-top:var(--space-lg)">
            <button class="btn btn-primary" onclick="App.navigateTo('queue')">View Queue</button>
            <button class="btn btn-outline" onclick="App.navigateTo('register')">New Patient</button>
          </div>
        </div>`;
      Utils.showToast('Appointment booked successfully!', 'success');
    } catch(err) {
      Utils.showToast('Booking failed: ' + err.message, 'error');
      btn.disabled = false;
      btn.textContent = '✓ Confirm Appointment';
    }
  }
};

// Queue Manager
const QueueManager = {
  async load() {
    const container = document.getElementById('queueContainer');
    container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading queue...</p></div>';

    const appointments = await DB.getAppointmentsPriority();
    if (appointments.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p class="empty-state-title">No appointments in queue</p><p>Appointments will appear here once patients book them.</p></div>';
      return;
    }

    const critical = appointments.filter(a => a.severity === 'critical');
    const normal = appointments.filter(a => a.severity === 'normal');
    let pos = 1;

    let html = '';
    if (critical.length > 0) {
      html += `<div class="queue-section"><div class="queue-section-title"><span class="dot critical"></span> Critical Patients (${critical.length})</div>`;
      html += critical.map(a => this.renderQueueCard(a, pos++, 'critical')).join('');
      html += '</div>';
    }
    if (normal.length > 0) {
      html += `<div class="queue-section"><div class="queue-section-title"><span class="dot normal"></span> Normal Patients (${normal.length})</div>`;
      html += normal.map(a => this.renderQueueCard(a, pos++, 'normal')).join('');
      html += '</div>';
    }
    container.innerHTML = html;
  },

  renderQueueCard(a, pos, severity) {
    return `
      <div class="glass-card queue-card animate-fade">
        <div class="queue-position ${severity}">${pos}</div>
        <div class="queue-details">
          <h4>${Utils.sanitize(a.patient_name)} <span class="badge badge-${severity}">${severity}</span></h4>
          <div class="queue-meta">
            <span>👨‍⚕️ ${Utils.sanitize(a.doctor_name)}</span>
            <span>🏥 ${Utils.sanitize(a.hospital_name)}</span>
            <span>📅 ${Utils.formatDate(a.appointment_date)}</span>
            <span>🕐 ${a.time_slot}</span>
          </div>
        </div>
        <div class="queue-actions">
          <button class="btn btn-ghost btn-sm" onclick="QueueManager.cancelAppointment('${a.id}')">Cancel</button>
        </div>
      </div>`;
  },

  async cancelAppointment(id) {
    Utils.showModal('Cancel Appointment', '<p style="color:var(--text-secondary)">Are you sure you want to cancel this appointment?</p>',
      `<button class="btn btn-ghost" onclick="Utils.closeModal()">No, Keep It</button>
       <button class="btn btn-danger" onclick="QueueManager.doCancel('${id}')">Yes, Cancel</button>`);
  },

  async doCancel(id) {
    try {
      await DB.update('appointments', id, { status: 'cancelled' });
      Utils.closeModal();
      Utils.showToast('Appointment cancelled', 'success');
      this.load();
    } catch(err) { Utils.showToast('Failed to cancel', 'error'); }
  }
};

// Doctor Management
const DoctorManagement = {
  async load() {
    const container = document.getElementById('doctorsContainer');
    container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading doctors...</p></div>';

    const doctors = await DB.getDoctorsWithHospital();
    if (doctors.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No doctors found.</p></div>';
      return;
    }

    const cards = [];
    for (const doc of doctors) {
      const leaves = await DB.getDoctorLeaves(doc.id);
      const hasLeave = leaves.length > 0;
      const hospitalName = doc.hospitals ? doc.hospitals.name : 'Unknown';

      cards.push(`
        <div class="glass-card doctor-card animate-fade">
          <div class="doctor-card-header">
            <div class="avatar doctor-avatar" style="background:${Utils.getAvatarColor(doc.name)}">${Utils.getInitials(doc.name)}</div>
            <div>
              <h3 class="doctor-card-name">${Utils.sanitize(doc.name)}</h3>
              <p class="doctor-card-specialty">${doc.specialty}</p>
            </div>
          </div>
          <div class="doctor-card-info">
            <span>🏥 ${Utils.sanitize(hospitalName)}</span>
            <span>📅 ${doc.experience_years} yrs</span>
            <span>${Utils.renderStars(doc.rating)}</span>
          </div>
          ${hasLeave ? `<div class="leave-info"><p>📌 Upcoming Leave</p><p class="leave-dates">${Utils.formatDate(leaves[0].leave_start)} — ${Utils.formatDate(leaves[0].leave_end)}</p><p>${leaves[0].reason}</p></div>` : ''}
          <div class="availability-toggle">
            <span class="toggle-label">${doc.is_available ? '✅ Available' : '❌ Unavailable'}</span>
            <button class="btn btn-outline btn-sm" onclick="DoctorManagement.showLeaveForm('${doc.id}','${Utils.sanitize(doc.name)}')">Manage Leave</button>
          </div>
        </div>`);
    }
    container.innerHTML = `<div class="cards-grid">${cards.join('')}</div>`;
  },

  showLeaveForm(doctorId, doctorName) {
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    Utils.showModal(`Manage Leave — ${doctorName}`,
      `<div class="form-group">
        <label class="form-label">Leave Start Date</label>
        <input type="date" class="form-input" id="leaveStart" min="${minDate}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Leave End Date</label>
        <input type="date" class="form-input" id="leaveEnd" min="${minDate}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Reason</label>
        <select class="form-select" id="leaveReason">
          <option value="Vacation">Vacation</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Conference">Conference</option>
          <option value="Personal">Personal</option>
          <option value="Holiday">Holiday</option>
        </select>
      </div>`,
      `<button class="btn btn-ghost" onclick="Utils.closeModal()">Cancel</button>
       <button class="btn btn-primary" onclick="DoctorManagement.submitLeave('${doctorId}')">Set Leave</button>`);
  },

  async submitLeave(doctorId) {
    const start = document.getElementById('leaveStart').value;
    const end = document.getElementById('leaveEnd').value;
    const reason = document.getElementById('leaveReason').value;

    if (!start || !end) { Utils.showToast('Please select both dates', 'error'); return; }
    if (end < start) { Utils.showToast('End date must be after start date', 'error'); return; }

    try {
      await DB.insert('doctor_leaves', { doctor_id: doctorId, leave_start: start, leave_end: end, reason });
      await DB.update('doctors', doctorId, { is_available: false });
      Utils.closeModal();
      Utils.showToast('Leave scheduled successfully', 'success');
      this.load();
    } catch(err) { Utils.showToast('Failed to set leave: ' + err.message, 'error'); }
  }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
  Registration.init();
  lucide.createIcons();
});

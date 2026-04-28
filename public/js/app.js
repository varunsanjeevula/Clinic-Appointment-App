// Main Application Controller
const App = {
  currentPage: 'dashboard', currentPatient: null, triageResult: null,
  selectedHospital: null, selectedDoctor: null, selectedDate: null, selectedSlot: null,

  init() {
    this.setupNavigation();
    this.setupModalClose();
    this.navigateTo(window.location.hash.slice(1) || 'dashboard');
  },
  setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', e => { e.preventDefault(); this.navigateTo(item.dataset.page); });
    });
  },
  setupModalClose() {
    document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target.id === 'modalOverlay') Utils.closeModal(); });
    document.getElementById('modalCloseBtn').addEventListener('click', () => Utils.closeModal());
  },
  navigateTo(page) {
    if (!page) page = 'dashboard';
    this.currentPage = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const el = document.getElementById(`page-${page}`);
    if (el) el.classList.add('active');
    document.querySelectorAll(`.nav-item[data-page="${page}"]`).forEach(n => n.classList.add('active'));
    window.location.hash = page;
    if (page === 'dashboard') this.loadDashboard();
    else if (page === 'queue') QueueManager.load();
    else if (page === 'doctors') DoctorManagement.load();
  },
  updateGreeting() {
    const h = new Date().getHours();
    const g = h < 12 ? 'Good Morning ☀️' : h < 17 ? 'Good Afternoon 👋' : 'Good Evening 🌙';
    document.getElementById('greetingTitle').textContent = g;
    const now = new Date();
    document.getElementById('currentDate').querySelector('span').textContent =
      now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  },
  async loadDashboard() {
    this.updateGreeting();
    try {
      const [stats, recent] = await Promise.all([API.getStats(), API.getRecentAppointments()]);
      document.getElementById('statPatients').textContent = stats.totalPatients;
      document.getElementById('statToday').textContent = stats.todayAppointments;
      document.getElementById('statCritical').textContent = stats.criticalCases;
      document.getElementById('statDoctors').textContent = stats.availableDoctors;

      const tbody = document.getElementById('recentBody');
      if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No appointments yet</td></tr>';
      } else {
        tbody.innerHTML = recent.map(a => `<tr>
          <td><div class="patient-cell"><div class="avatar" style="background:${Utils.getAvatarColor(a.patient_name)}">${Utils.getInitials(a.patient_name)}</div><span>${Utils.sanitize(a.patient_name)}</span></div></td>
          <td>${Utils.sanitize(a.doctor_name)}</td><td>${Utils.sanitize(a.hospital_name)}</td>
          <td>${Utils.formatDate(a.appointment_date)}</td><td>${a.time_slot}</td>
          <td><span class="badge badge-${a.severity}">${a.severity}</span></td></tr>`).join('');
      }
      // Activity panel
      const al = document.getElementById('activityList');
      if (recent.length === 0) { al.innerHTML = '<p style="color:var(--text-muted);font-size:var(--text-xs);text-align:center;padding:var(--space-xl)">No recent activity</p>'; }
      else { al.innerHTML = recent.slice(0, 6).map(a => {
        const dot = a.severity === 'critical' ? 'critical' : 'normal';
        const ago = Utils.timeAgo(a.created_at);
        return `<div class="activity-item"><div class="activity-dot ${dot}"></div><div class="activity-content"><div class="activity-title">${Utils.sanitize(a.patient_name)} → ${Utils.sanitize(a.doctor_name)}</div><div class="activity-meta">${Utils.sanitize(a.hospital_name)} · ${ago}</div></div></div>`;
      }).join(''); }
    } catch(err) { console.error('Dashboard error:', err); }
  }
};

// Registration
const Registration = {
  init() { document.getElementById('registerForm').addEventListener('submit', e => { e.preventDefault(); this.handleSubmit(); }); },
  async handleSubmit() {
    const name = document.getElementById('patientName').value.trim();
    const phone = document.getElementById('patientPhone').value.trim();
    const address = document.getElementById('patientAddress').value.trim();
    const symptoms = document.getElementById('patientSymptoms').value.trim();
    if (!name || !phone || !address || !symptoms) { Utils.showToast('Please fill in all fields', 'error'); return; }
    if (!Utils.isValidPhone(phone)) { Utils.showToast('Please enter a valid phone number', 'error'); return; }
    const btn = document.getElementById('registerBtn');
    btn.disabled = true; btn.innerHTML = '<div class="spinner" style="width:18px;height:18px;border-width:2px"></div> Analyzing...';
    try {
      const result = await API.registerPatient({ full_name: name, contact_number: phone, address, symptoms });
      App.currentPatient = result.patient; App.triageResult = result.triage;
      Utils.showToast('Patient registered!', 'success');
      document.getElementById('registerForm').reset();
      this.showTriageResults(result.patient, result.triage);
    } catch(err) { Utils.showToast('Registration failed: ' + err.message, 'error'); }
    finally { btn.disabled = false; btn.innerHTML = '<i data-lucide="scan-search" style="width:18px;height:18px"></i> Analyze & Register'; lucide.createIcons(); }
  },
  async showTriageResults(patient, triage) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-triage').classList.add('active');
    const isCrit = triage.severity === 'critical';
    document.getElementById('triageResultArea').innerHTML = `<div class="severity-display ${triage.severity} animate-scale">
      <div class="severity-icon">${isCrit ? '🚨' : '✅'}</div>
      <h2 class="severity-title">${isCrit ? 'CRITICAL — Urgent Attention Required' : 'NORMAL — Non-Urgent'}</h2>
      <p class="severity-desc">${triage.recommendation}</p>
      <div class="matched-symptoms">${triage.matchedCritical.map(s => `<span class="symptom-chip critical">${s}</span>`).join('')}${triage.matchedNormal.map(s => `<span class="symptom-chip normal">${s}</span>`).join('')}</div></div>`;
    document.getElementById('suggestedSpecialties').innerHTML = triage.suggestedSpecialties.map(s => `<span class="tag tag-specialty">${s}</span>`).join(' ');
    const hospitals = await API.getHospitals();
    const rec = hospitals.filter(h => h.specialties.some(s => triage.suggestedSpecialties.includes(s))).sort((a, b) => {
      const am = a.specialties.filter(s => triage.suggestedSpecialties.includes(s)).length;
      const bm = b.specialties.filter(s => triage.suggestedSpecialties.includes(s)).length;
      if (isCrit && b.has_emergency !== a.has_emergency) return b.has_emergency ? 1 : -1;
      return bm - am || b.rating - a.rating;
    });
    const c = document.getElementById('hospitalRecommendations');
    if (!rec.length) { c.innerHTML = '<div class="empty-state"><p>No matching hospitals found.</p></div>'; return; }
    c.innerHTML = rec.map(h => `<div class="glass-card hospital-card animate-fade">
      <div class="hospital-card-header"><div class="hospital-icon ${h.type === 'hospital' ? 'hospital-type' : 'clinic-type'}">${h.type === 'hospital' ? '🏥' : '🏪'}</div>
      <div><h3 class="hospital-name">${Utils.sanitize(h.name)}</h3><p class="hospital-address">📍 ${Utils.sanitize(h.address)}</p></div></div>
      <div class="hospital-specialties">${h.specialties.map(s => `<span class="tag ${triage.suggestedSpecialties.includes(s) ? '' : 'tag-specialty'}">${s}</span>`).join('')}</div>
      <div class="hospital-meta"><div>${Utils.renderStars(h.rating)} ${h.has_emergency ? '<span class="emergency-badge">🚑 ER</span>' : ''}</div>
      <button class="btn btn-primary btn-sm" onclick="BookingManager.startBooking('${h.id}')">Book Here →</button></div></div>`).join('');
  }
};

// Booking
const BookingManager = {
  doctors: [],
  async startBooking(hid) {
    const h = await API.getHospital(hid);
    if (!h) { Utils.showToast('Hospital not found', 'error'); return; }
    App.selectedHospital = h; App.selectedDoctor = null; App.selectedDate = null; App.selectedSlot = null;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-booking').classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('bookingHospitalName').textContent = h.name;
    this.updateSteps(1); await this.loadDoctors(hid);
  },
  updateSteps(step) { document.querySelectorAll('.step').forEach((s, i) => { s.classList.remove('active', 'completed'); if (i+1 < step) s.classList.add('completed'); if (i+1 === step) s.classList.add('active'); }); },
  async loadDoctors(hid) {
    const all = await API.getDoctors(hid);
    const specs = App.triageResult ? App.triageResult.suggestedSpecialties : [];
    this.doctors = all.sort((a, b) => (specs.includes(b.specialty)?1:0) - (specs.includes(a.specialty)?1:0));
    const c = document.getElementById('doctorsList');
    if (!this.doctors.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">👨‍⚕️</div><p class="empty-state-title">No doctors available</p></div>'; return; }
    const cards = [];
    for (const doc of this.doctors) {
      const leaves = await API.getDoctorLeaves(doc.id);
      const onL = leaves.length > 0, isM = specs.includes(doc.specialty);
      const lv = onL ? `<div class="leave-notice">⚠️ On leave: ${Utils.formatDate(leaves[0].leave_start)} — ${Utils.formatDate(leaves[0].leave_end)}</div>` : '';
      cards.push(`<div class="glass-card doctor-select-card ${onL?'on-leave':''}" data-doctor-id="${doc.id}" onclick="${onL?'':`BookingManager.selectDoctor('${doc.id}')`}">
        <div class="avatar doctor-avatar" style="background:${Utils.getAvatarColor(doc.name)}">${Utils.getInitials(doc.name)}</div>
        <div class="doctor-info"><h4>${Utils.sanitize(doc.name)} ${isM?'<span class="badge badge-info">Recommended</span>':''}</h4>
        <p>${doc.specialty} · ${doc.experience_years} yrs · ${Utils.renderStars(doc.rating)}</p>
        ${onL ? lv : '<span style="color:var(--success);font-size:11px">✓ Available</span>'}</div></div>`);
    }
    c.innerHTML = cards.join('');
  },
  selectDoctor(did) {
    const doc = this.doctors.find(d => d.id === did); if (!doc) return;
    App.selectedDoctor = doc;
    document.querySelectorAll('.doctor-select-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`[data-doctor-id="${did}"]`).classList.add('selected');
    this.updateSteps(2); this.showDatePicker();
  },
  showDatePicker() {
    const days = Utils.getNextDays(7);
    document.getElementById('datePickerArea').innerHTML = `<h3 style="margin-bottom:var(--space-base);font-size:var(--text-lg)">Select Date</h3>
      <div class="date-grid">${days.map(d => `<button class="date-btn" data-date="${d.date}" onclick="BookingManager.selectDate('${d.date}')">
        <div class="date-day">${d.day}</div><div class="date-num">${d.num}</div><div class="date-day">${d.month}</div></button>`).join('')}</div>`;
    document.getElementById('datePickerArea').style.display = 'block';
    document.getElementById('timeSlotsArea').style.display = 'none';
    document.getElementById('confirmArea').style.display = 'none';
  },
  async selectDate(date) {
    const { onLeave } = await API.isDoctorOnLeave(App.selectedDoctor.id, date);
    if (onLeave) { Utils.showToast('Doctor is on leave this date.', 'warning'); return; }
    App.selectedDate = date;
    document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('selected'));
    document.querySelector(`[data-date="${date}"]`).classList.add('selected');
    this.updateSteps(3); await this.loadTimeSlots(date);
  },
  async loadTimeSlots(date) {
    const slots = Utils.getTimeSlots();
    const booked = await API.getBookedSlots(App.selectedDoctor.id, date);
    document.getElementById('timeSlotsArea').innerHTML = `<h3 style="margin-bottom:var(--space-base);font-size:var(--text-lg)">Select Time Slot</h3>
      <div class="slots-grid">${slots.map(s => `<button class="slot-btn ${booked.includes(s)?'booked':''}" ${booked.includes(s)?'disabled':''} onclick="BookingManager.selectSlot('${s}')">${s}</button>`).join('')}</div>`;
    document.getElementById('timeSlotsArea').style.display = 'block';
    document.getElementById('confirmArea').style.display = 'none';
  },
  selectSlot(slot) {
    App.selectedSlot = slot;
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
    event.target.classList.add('selected'); this.showConfirmation();
  },
  showConfirmation() {
    const area = document.getElementById('confirmArea');
    area.style.display = 'block';
    area.innerHTML = `<div class="divider"></div><h3 style="margin-bottom:var(--space-lg);font-size:var(--text-lg)">Confirm Appointment</h3>
      <div class="glass-card-static"><div class="confirmation-details">
        <div class="detail-item"><div class="detail-label">Patient</div><div class="detail-value">${Utils.sanitize(App.currentPatient.full_name)}</div></div>
        <div class="detail-item"><div class="detail-label">Severity</div><div class="detail-value"><span class="badge badge-${App.triageResult.severity}">${App.triageResult.severity}</span></div></div>
        <div class="detail-item"><div class="detail-label">Hospital</div><div class="detail-value">${Utils.sanitize(App.selectedHospital.name)}</div></div>
        <div class="detail-item"><div class="detail-label">Doctor</div><div class="detail-value">${Utils.sanitize(App.selectedDoctor.name)}</div></div>
        <div class="detail-item"><div class="detail-label">Date</div><div class="detail-value">${Utils.formatDate(App.selectedDate)}</div></div>
        <div class="detail-item"><div class="detail-label">Time</div><div class="detail-value">${App.selectedSlot}</div></div>
      </div><button class="btn btn-primary btn-lg btn-block" onclick="BookingManager.confirmBooking()" id="confirmBtn">✓ Confirm Appointment</button></div>`;
    area.scrollIntoView({ behavior: 'smooth' });
  },
  async confirmBooking() {
    const btn = document.getElementById('confirmBtn');
    btn.disabled = true; btn.textContent = 'Booking...';
    try {
      await API.bookAppointment({ patient_id: App.currentPatient.id, patient_name: App.currentPatient.full_name,
        doctor_id: App.selectedDoctor.id, doctor_name: App.selectedDoctor.name, hospital_id: App.selectedHospital.id,
        hospital_name: App.selectedHospital.name, specialty: App.selectedDoctor.specialty,
        appointment_date: App.selectedDate, time_slot: App.selectedSlot, severity: App.triageResult.severity });
      document.getElementById('confirmArea').innerHTML = `<div class="glass-card-static confirmation-card animate-scale">
        <div class="confirmation-icon">🎉</div><h2 class="confirmation-title">Appointment Booked!</h2>
        <p style="color:var(--text-secondary);margin-bottom:var(--space-2xl)">Successfully scheduled.</p>
        <div class="confirmation-details">
          <div class="detail-item"><div class="detail-label">Patient</div><div class="detail-value">${Utils.sanitize(App.currentPatient.full_name)}</div></div>
          <div class="detail-item"><div class="detail-label">Doctor</div><div class="detail-value">${Utils.sanitize(App.selectedDoctor.name)}</div></div>
          <div class="detail-item"><div class="detail-label">Date</div><div class="detail-value">${Utils.formatDate(App.selectedDate)}</div></div>
          <div class="detail-item"><div class="detail-label">Time</div><div class="detail-value">${App.selectedSlot}</div></div>
        </div><div style="display:flex;gap:var(--space-md);justify-content:center;margin-top:var(--space-xl)">
          <button class="btn btn-primary" onclick="App.navigateTo('queue')">View Queue</button>
          <button class="btn btn-outline" onclick="App.navigateTo('register')">New Patient</button></div></div>`;
      Utils.showToast('Appointment booked!', 'success');
    } catch(err) { Utils.showToast('Booking failed: ' + err.message, 'error'); btn.disabled = false; btn.textContent = '✓ Confirm Appointment'; }
  }
};

// Queue Manager
const QueueManager = {
  allAppointments: [], currentFilter: 'all',
  async load() {
    const c = document.getElementById('queueContainer');
    c.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading queue...</p></div>';
    try {
      this.allAppointments = await API.getAppointmentQueue();
      this.render();
    } catch(err) { c.innerHTML = '<div class="empty-state"><p>Failed to load queue.</p></div>'; }
  },
  filter(type) {
    this.currentFilter = type;
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.filter-tab[data-filter="${type}"]`).classList.add('active');
    this.render();
  },
  render() {
    const c = document.getElementById('queueContainer');
    let appts = this.allAppointments;
    if (this.currentFilter !== 'all') appts = appts.filter(a => a.severity === this.currentFilter);
    if (!appts.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p class="empty-state-title">No appointments found</p></div>'; return; }
    const critical = appts.filter(a => a.severity === 'critical');
    const normal = appts.filter(a => a.severity === 'normal');
    let pos = 1, html = '';
    if (critical.length > 0) {
      html += `<div class="queue-section"><div class="queue-section-title"><span class="dot critical"></span> Critical (${critical.length})</div>`;
      html += critical.map(a => this.card(a, pos++, 'critical')).join('') + '</div>';
    }
    if (normal.length > 0) {
      html += `<div class="queue-section"><div class="queue-section-title"><span class="dot normal"></span> Normal (${normal.length})</div>`;
      html += normal.map(a => this.card(a, pos++, 'normal')).join('') + '</div>';
    }
    c.innerHTML = html;
  },
  card(a, pos, sev) {
    return `<div class="glass-card queue-card animate-fade"><div class="queue-position ${sev}">${pos}</div>
      <div class="queue-details"><h4>${Utils.sanitize(a.patient_name)} <span class="badge badge-${sev}">${sev}</span></h4>
      <div class="queue-meta"><span>👨‍⚕️ ${Utils.sanitize(a.doctor_name)}</span><span>🏥 ${Utils.sanitize(a.hospital_name)}</span>
      <span>📅 ${Utils.formatDate(a.appointment_date)}</span><span>🕐 ${a.time_slot}</span></div></div>
      <div class="queue-actions"><button class="btn btn-ghost btn-sm" onclick="QueueManager.cancelAppointment('${a.id}')">Cancel</button></div></div>`;
  },
  cancelAppointment(id) {
    Utils.showModal('Cancel Appointment', '<p style="color:var(--text-secondary)">Are you sure you want to cancel?</p>',
      `<button class="btn btn-ghost" onclick="Utils.closeModal()">Keep</button><button class="btn btn-danger" onclick="QueueManager.doCancel('${id}')">Cancel</button>`);
  },
  async doCancel(id) {
    try { await API.cancelAppointment(id); Utils.closeModal(); Utils.showToast('Cancelled', 'success'); this.load(); }
    catch(err) { Utils.showToast('Failed', 'error'); }
  }
};

// Doctor Management
const DoctorManagement = {
  allDoctors: [], allCards: [],
  async load() {
    const c = document.getElementById('doctorsContainer');
    c.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading doctors...</p></div>';
    try {
      this.allDoctors = await API.getDoctors();
      if (!this.allDoctors.length) { c.innerHTML = '<div class="empty-state"><p>No doctors found.</p></div>'; return; }
      const cards = [];
      for (const doc of this.allDoctors) {
        const leaves = await API.getDoctorLeaves(doc.id);
        const hasL = leaves.length > 0;
        const hn = doc.hospitals ? doc.hospitals.name : 'Unknown';
        cards.push({ name: doc.name, specialty: doc.specialty, html: `<div class="glass-card doctor-card animate-fade" data-doctor-name="${doc.name.toLowerCase()} ${doc.specialty.toLowerCase()}">
          <div class="doctor-card-header"><div class="avatar doctor-avatar" style="background:${Utils.getAvatarColor(doc.name)}">${Utils.getInitials(doc.name)}</div>
          <div><h3 class="doctor-card-name">${Utils.sanitize(doc.name)}</h3><p class="doctor-card-specialty">${doc.specialty}</p></div></div>
          <div class="doctor-card-info"><span>🏥 ${Utils.sanitize(hn)}</span><span>📅 ${doc.experience_years} yrs</span><span>${Utils.renderStars(doc.rating)}</span></div>
          ${hasL ? `<div class="leave-info"><p>📌 Upcoming Leave</p><p class="leave-dates">${Utils.formatDate(leaves[0].leave_start)} — ${Utils.formatDate(leaves[0].leave_end)}</p><p>${leaves[0].reason}</p></div>` : ''}
          <div class="availability-toggle"><span class="toggle-label">${doc.is_available ? '✅ Available' : '❌ Unavailable'}</span>
          <button class="btn btn-outline btn-sm" onclick="DoctorManagement.showLeaveForm('${doc.id}','${Utils.sanitize(doc.name)}')">Manage Leave</button></div></div>` });
      }
      this.allCards = cards;
      c.innerHTML = `<div class="cards-grid">${cards.map(c => c.html).join('')}</div>`;
    } catch(err) { c.innerHTML = '<div class="empty-state"><p>Failed to load doctors.</p></div>'; }
  },
  search(q) {
    const query = q.toLowerCase();
    document.querySelectorAll('[data-doctor-name]').forEach(card => {
      card.style.display = card.dataset.doctorName.includes(query) ? '' : 'none';
    });
  },
  showLeaveForm(did, name) {
    const tom = new Date(); tom.setDate(tom.getDate() + 1);
    const min = tom.toISOString().split('T')[0];
    Utils.showModal(`Leave — ${name}`,
      `<div class="form-group"><label class="form-label">Start Date</label><input type="date" class="form-input" id="leaveStart" min="${min}" required></div>
      <div class="form-group"><label class="form-label">End Date</label><input type="date" class="form-input" id="leaveEnd" min="${min}" required></div>
      <div class="form-group"><label class="form-label">Reason</label><select class="form-select" id="leaveReason">
        <option value="Vacation">Vacation</option><option value="Sick Leave">Sick Leave</option><option value="Conference">Conference</option><option value="Personal">Personal</option></select></div>`,
      `<button class="btn btn-ghost" onclick="Utils.closeModal()">Cancel</button><button class="btn btn-primary" onclick="DoctorManagement.submitLeave('${did}')">Set Leave</button>`);
  },
  async submitLeave(did) {
    const s = document.getElementById('leaveStart').value, e = document.getElementById('leaveEnd').value, r = document.getElementById('leaveReason').value;
    if (!s || !e) { Utils.showToast('Select both dates', 'error'); return; }
    if (e < s) { Utils.showToast('End must be after start', 'error'); return; }
    try { await API.setDoctorLeave(did, { leave_start: s, leave_end: e, reason: r }); Utils.closeModal(); Utils.showToast('Leave set', 'success'); this.load(); }
    catch(err) { Utils.showToast('Failed: ' + err.message, 'error'); }
  }
};

document.addEventListener('DOMContentLoaded', () => { App.init(); Registration.init(); lucide.createIcons(); });

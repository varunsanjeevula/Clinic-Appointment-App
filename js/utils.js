// Utility functions used across the application

const Utils = {
  // Toast notifications
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 300); }, 3500);
  },

  // Modal
  showModal(title, bodyHTML, footerHTML = '') {
    const overlay = document.getElementById('modalOverlay');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHTML;
    document.getElementById('modalFooter').innerHTML = footerHTML;
    overlay.classList.add('active');
  },
  closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
  },

  // Format date
  formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  },

  // Get next N days (excluding Sundays)
  getNextDays(n = 7) {
    const days = [];
    const today = new Date();
    let d = new Date(today);
    d.setDate(d.getDate() + 1); // Start from tomorrow
    while (days.length < n) {
      if (d.getDay() !== 0) { // Skip Sundays
        days.push({
          date: d.toISOString().split('T')[0],
          day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
          num: d.getDate(),
          month: d.toLocaleDateString('en-IN', { month: 'short' })
        });
      }
      d.setDate(d.getDate() + 1);
    }
    return days;
  },

  // Time slots
  getTimeSlots() {
    return ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM'];
  },

  // Generate avatar color from name
  getAvatarColor(name) {
    const colors = ['#6366f1','#8b5cf6','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#14b8a6','#06b6d4','#3b82f6'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  },

  // Get initials from name
  getInitials(name) {
    return name.split(' ').filter(Boolean).map(w => w[0]).join('').substring(0, 2).toUpperCase();
  },

  // Render star rating
  renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    let html = '';
    for (let i = 0; i < full; i++) html += '★';
    if (half) html += '½';
    return `<span class="rating">${html}<span class="rating-value">${rating}</span></span>`;
  },

  // Validate phone number
  isValidPhone(phone) {
    return /^[\d\s\-\+\(\)]{7,15}$/.test(phone);
  },

  // Sanitize input
  sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

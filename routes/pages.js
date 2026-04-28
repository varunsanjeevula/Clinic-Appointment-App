// ============================================
// Page Routes — Server-rendered EJS views
// ============================================

const express = require('express');
const router = express.Router();

// Single-page app — all routes serve the main layout
router.get('/', (req, res) => {
  res.render('index', { title: 'MedQueue — Clinic Appointment Manager' });
});

module.exports = router;

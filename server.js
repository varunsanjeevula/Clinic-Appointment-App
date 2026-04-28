// ============================================
// MedQueue — Express Server
// Full-stack Clinic Appointment Management
// ============================================

require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets (CSS, client-side JS, images)
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── API Routes ─────────────────────────────
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

// ── Page Routes ────────────────────────────
const pageRouter = require('./routes/pages');
app.use('/', pageRouter);

// ── Error Handling ─────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// ── Start Server ───────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🏥  MedQueue Server Running`);
  console.log(`  ──────────────────────────`);
  console.log(`  🌐  Local:   http://localhost:${PORT}`);
  console.log(`  📦  Mode:    ${process.env.NODE_ENV || 'development'}`);
  console.log(`  ⚡  Status:  Ready\n`);
});

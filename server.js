import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB, getCredentials } from './db.js';
import apiRouter from './api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ============================
// 1. Body parser (MUST be first)
// ============================
app.use(express.json());

// ============================
// 2. Request logger
// ============================
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// ============================
// 3. Health check (before everything)
// ============================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '2026-04-04-v2', time: new Date().toISOString() });
});

// ============================
// 4. Direct login endpoint (guaranteed to work)
// ============================
app.post('/api/auth/login', async (req, res) => {
  console.log('🔐 LOGIN ATTEMPT:', JSON.stringify(req.body));
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username va password kerak' });
    }
    const creds = await getCredentials();
    console.log('🔐 DB creds:', creds.username, '/', creds.password);
    if (username.trim() === creds.username.trim() && password.trim() === creds.password.trim()) {
      console.log('✅ Login SUCCESS');
      return res.json({ success: true });
    } else {
      console.log('❌ Login FAILED - credentials mismatch');
      return res.status(401).json({ error: 'Login yoki parol noto\'g\'ri' });
    }
  } catch (err) {
    console.error('💥 Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ============================
// 5. API router (all /api/* routes)
// ============================
app.use('/api', apiRouter);

// ============================
// 6. Admin panel static files
// ============================
app.use('/admin-panel', express.static(path.join(__dirname, 'dist', 'admin-panel')));
app.get('/admin-panel/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'admin-panel', 'index.html'));
});

// ============================
// 7. Main portfolio static files (LAST!)
// ============================
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  // Don't catch /api or /health routes
  if (req.url.startsWith('/api') || req.url === '/health') {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ============================
// 8. Start server
// ============================
async function start() {
  try {
    await initDB();
    console.log('🚀 Server version: 2026-04-04-v2');
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📦 Portfolio: http://localhost:${PORT}`);
      console.log(`🔧 Admin: http://localhost:${PORT}/admin-panel`);
      console.log(`🔌 API: http://localhost:${PORT}/api`);
      console.log(`💚 Health: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('💀 Failed to start:', err);
    process.exit(1);
  }
}

start();

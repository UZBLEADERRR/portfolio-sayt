import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './db.js';
import apiRouter from './api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Primary Auth Endpoint (direct mount for debugging)
import { getCredentials } from './db.js';
app.post('/api/auth/login', async (req, res) => {
  console.log('📬 [CRITICAL] Main server heard POST /api/auth/login');
  try {
    const { username, password } = req.body;
    const creds = await getCredentials();
    const cleanUser = username?.trim();
    const cleanPass = password?.trim();
    if (cleanUser === creds.username.trim() && cleanPass === creds.password.trim()) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Login yoki parol noto\'g\'ri' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// API routes
console.log('✅ Attaching API router to /api');
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Serve admin panel
app.use('/admin-panel', express.static(path.join(__dirname, 'dist', 'admin-panel')));
app.get('/admin-panel/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'admin-panel', 'index.html'));
});

// Serve main portfolio
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start
async function start() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Portfolio: http://localhost:${PORT}`);
      console.log(`Admin Trace: http://localhost:${PORT}/admin-panel`);
      console.log(`API: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
}

start();

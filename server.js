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

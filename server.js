import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB, getData, setData, getCredentials, setCredentials, pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Body parser
app.use(express.json());

// 2. Logger
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// ================================
// ALL API ROUTES (inline, no router)
// ================================

const publicKeys = ['resume', 'projects', 'services', 'courses', 'blog', 'stats', 'socials', 'ai_settings'];

// Health
app.get('/health', (req, res) => res.json({ status: 'ok', v: '2026-04-04-v3' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', v: '2026-04-04-v3' }));

// GET data
app.get('/api/data/:key', async (req, res) => {
  try {
    if (!publicKeys.includes(req.params.key)) return res.status(404).json({ error: 'Not found' });
    const data = await getData(req.params.key);
    res.json(data);
  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT data (save from admin panel)
app.put('/api/data/:key', async (req, res) => {
  try {
    if (!publicKeys.includes(req.params.key)) return res.status(404).json({ error: 'Not found' });
    console.log(`📝 Saving: ${req.params.key}`);
    await setData(req.params.key, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error('PUT error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Auth login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const creds = await getCredentials();
    if (username?.trim() === creds.username.trim() && password?.trim() === creds.password.trim()) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Login yoki parol noto\'g\'ri' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update credentials
app.put('/api/auth/credentials', async (req, res) => {
  try {
    const { username, password } = req.body;
    await setCredentials(username, password);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Messages
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await pool.query('INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)', [name, email, subject, message]);
    res.json({ success: true, message: 'Xabaringiz yuborildi!' });
  } catch (err) {
    console.error('Message error:', err);
    res.status(500).json({ error: 'Xabarni yuborishda xatolik.' });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// AI Chat
app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

    const { messages, userMessage } = req.body;
    const aiSettings = await getData('ai_settings');
    const basePrompt = aiSettings?.systemPrompt || 'Sen Sarvarning AI yordamchisisan.';
    const knowledgeBase = aiSettings?.knowledgeBase || '';

    const formatInstructions = `
MUHIM KO'RSATMALAR:
1. Javob berishda Markdown belgilaridan (**, ##, *, __) ASLO FOYDALANMA.
2. Muhim so'zlarni KATTA HARFLAR bilan yoz yoki emoji qo'y.
3. Javoblaring batafsil va tushunarli bo'lsin.
4. Emojilardan ko'p foydalan.
5. Do'stona va professional bo'l.
`;

    const fullPrompt = `${basePrompt}\n${formatInstructions}\n\nQo'shimcha bilim bazasi:\n${knowledgeBase}`;
    const contents = [
      { role: 'user', parts: [{ text: fullPrompt }] },
      { role: 'model', parts: [{ text: 'Tushundim! Men Sarvarning AI yordamchisiman.' }] },
      ...(messages || []).map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
      { role: 'user', parts: [{ text: userMessage }] },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents }) }
    );
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Javob olishda xatolik.';
    res.json({ text });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ================================
// STATIC FILES (must be AFTER api)
// ================================

// Admin panel
app.use('/admin-panel', express.static(path.join(__dirname, 'dist', 'admin-panel')));
app.get('/admin-panel/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'admin-panel', 'index.html'));
});

// Main portfolio
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  if (req.url.startsWith('/api') || req.url === '/health') {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ================================
// START
// ================================
async function start() {
  try {
    await initDB();
    console.log('🚀 Server v2026-04-04-v3 — ALL ROUTES INLINE');
    app.listen(PORT, () => {
      console.log(`✅ Running on port ${PORT}`);
    });
  } catch (err) {
    console.error('💀 Start failed:', err);
    process.exit(1);
  }
}

start();

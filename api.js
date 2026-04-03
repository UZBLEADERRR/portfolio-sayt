import express from 'express';
import { getData, setData, getCredentials, setCredentials } from './db.js';

const router = express.Router();

// ===== Public API (portfolio reads) =====
const publicKeys = ['resume', 'projects', 'services', 'courses', 'blog', 'stats', 'socials', 'ai_settings'];

// GET any section
router.get('/data/:key', async (req, res) => {
  try {
    if (!publicKeys.includes(req.params.key)) return res.status(404).json({ error: 'Not found' });
    const data = await getData(req.params.key);
    res.json(data);
  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== Auth =====
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const creds = await getCredentials();
    if (username === creds.username && password === creds.password) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Login yoki parol noto\'g\'ri' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== Admin API (write) =====
// Simple auth check via header
const adminAuth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const [username, password] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
    const creds = await getCredentials();
    if (username === creds.username && password === creds.password) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// SET any section (admin only)
router.put('/data/:key', adminAuth, async (req, res) => {
  try {
    if (!publicKeys.includes(req.params.key)) return res.status(404).json({ error: 'Not found' });
    await setData(req.params.key, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error('PUT error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update credentials
router.put('/auth/credentials', adminAuth, async (req, res) => {
  try {
    const { username, password } = req.body;
    await setCredentials(username, password);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== AI Chat Proxy (server-side, keeps API key safe) =====
router.post('/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

    const { messages, userMessage } = req.body;
    
    // Get AI settings from DB
    const aiSettings = await getData('ai_settings');
    const systemPrompt = aiSettings?.systemPrompt || 'Sen Sarvarning AI yordamchisisan.';
    const knowledgeBase = aiSettings?.knowledgeBase || '';
    
    const fullPrompt = knowledgeBase 
      ? `${systemPrompt}\n\nQo'shimcha bilim bazasi:\n${knowledgeBase}` 
      : systemPrompt;

    const contents = [
      { role: 'user', parts: [{ text: fullPrompt }] },
      { role: 'model', parts: [{ text: 'Tushundim! Men Sarvarning AI yordamchisiman.' }] },
      ...(messages || []).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text: userMessage }] },
    ];

    // Use Google GenAI REST API directly
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Javob olishda xatolik.';
    res.json({ text });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

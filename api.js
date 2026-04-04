import express from 'express';
import { getData, setData, getCredentials, setCredentials, pool } from './db.js';

const router = express.Router();

// ===== Public API (portfolio reads) =====
const publicKeys = ['resume', 'projects', 'services', 'courses', 'blog', 'stats', 'socials', 'ai_settings'];

// GET any section
router.get('/health', (req, res) => res.json({ status: 'ok', router: 'api' }));

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
  console.log('📬 POST /api/auth/login received');
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
    const cleanUser = username?.trim();
    const cleanPass = password?.trim();

    if (cleanUser === creds.username.trim() && cleanPass === creds.password.trim()) {
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

// ===== Messages API (public & admin) =====
// Save message (public)
router.post('/messages', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await pool.query(
      'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
      [name, email, subject, message]
    );
    res.json({ success: true, message: 'Xabaringiz yuborildi!' });
  } catch (err) {
    console.error('Message error:', err);
    res.status(500).json({ error: 'Xabarni yuborishda xatolik yuz berdi.' });
  }
});

// Get all messages (admin only)
router.get('/messages', adminAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Xabarlarni yuklashda xatolik yuz berdi.' });
  }
});

// Delete message (admin only)
router.delete('/messages/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Xabarni o\'chirishda xatolik yuz berdi.' });
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
    const basePrompt = aiSettings?.systemPrompt || 'Sen Sarvarning AI yordamchisishan.';
    const knowledgeBase = aiSettings?.knowledgeBase || '';
    
    // Explicit instructions to avoid Markdown symbols and be more detailed
    const formatInstructions = `
MUHIM KO'RSATMALAR:
1. Javob berishda Markdown belgilaridan (**, ##, *, __) ASLO FOYDALANMA. 
2. Muhim so'zlarni ajratib ko'rsatish uchun ularni KATTA HARFLAR bilan yozishing yoki shunchaki yoniga emoji qo'yishing mumkin.
3. Javoblaring judayam batafsil, "kengroq" va tushunarli bo'lsin. Qisqa javob berma.
4. Emojilardan o'rinli va ko'p foydalan. 
5. Har doim do'stona va professional tonni saqlab qol.
`;

    const fullPrompt = `${basePrompt}\n${formatInstructions}\n\nQo'shimcha bilim bazasi:\n${knowledgeBase}`;

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`,
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

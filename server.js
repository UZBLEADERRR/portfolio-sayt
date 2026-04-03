import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve admin panel at /admin
app.use('/admin', express.static(path.join(__dirname, 'dist', 'admin')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'admin', 'index.html'));
});

// Serve main portfolio
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Portfolio: http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
});

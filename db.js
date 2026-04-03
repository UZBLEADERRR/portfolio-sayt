import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV === 'production') {
  console.warn('⚠️  DATABASE_URL is missing! PostgreSQL connection will fail in production.');
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Create all tables
export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS portfolio_data (
      key VARCHAR(100) PRIMARY KEY,
      value JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS admin_credentials (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL DEFAULT 'admin',
      password VARCHAR(255) NOT NULL DEFAULT 'sarvar2024'
    );

    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100),
      subject VARCHAR(200),
      message TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      is_read BOOLEAN DEFAULT FALSE
    );
  `);

  // Insert default credentials if not exists
  const creds = await pool.query('SELECT * FROM admin_credentials');
  if (creds.rows.length === 0) {
    await pool.query(`INSERT INTO admin_credentials (username, password) VALUES ('admin', 'sarvar2024')`);
  }

  // Initial stats for sidebar
  const statsResult = await pool.query("SELECT * FROM portfolio_data WHERE key = 'stats'");
  const currentStats = statsResult.rows[0]?.value || [];
  
  // If no stats or just few demo stats, populate with a rich set
  if (currentStats.length < 3) {
     const defaultStats = [
       { id: '1', value: '15+', label: 'Loyihalar', icon: 'FolderKanban', details: ['SaaS platformalar', 'E-commerce', 'Dashboardlar'] },
       { id: '2', value: '3+', label: 'Tajriba', icon: 'Briefcase', details: ['Frontend (React)', 'Fullstack (Node.js)'] },
       { id: '3', value: '50+', label: 'Mijozlar', icon: 'Users', details: ['Xalqaro mijozlar', 'Mahalliy autsors'] },
       { id: '4', value: '12+', label: 'Sertifikatlar', icon: 'Award', details: ['Google Cloud', 'Meta Frontend', 'AWS'] },
       { id: '5', value: '24/7', label: 'Kodlash', icon: 'Clock', details: ['Doimiy o\'rganish', 'Yangi texnologiyalar'] }
     ];
     await setData('stats', defaultStats);
  }

  console.log('✅ Database initialized');
}

// Generic get/set for portfolio data
export async function getData(key) {
  const result = await pool.query('SELECT value FROM portfolio_data WHERE key = $1', [key]);
  return result.rows.length > 0 ? result.rows[0].value : [];
}

export async function setData(key, value) {
  await pool.query(
    `INSERT INTO portfolio_data (key, value, updated_at) VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
    [key, JSON.stringify(value)]
  );
}

export async function getCredentials() {
  const result = await pool.query('SELECT username, password FROM admin_credentials LIMIT 1');
  return result.rows[0] || { username: 'admin', password: 'sarvar2024' };
}

export async function setCredentials(username, password) {
  await pool.query('UPDATE admin_credentials SET username = $1, password = $2', [username, password]);
}

export { pool };

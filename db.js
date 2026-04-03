import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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
  `);

  // Insert default credentials if not exists
  const creds = await pool.query('SELECT * FROM admin_credentials');
  if (creds.rows.length === 0) {
    await pool.query(`INSERT INTO admin_credentials (username, password) VALUES ('admin', 'sarvar2024')`);
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

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',              // change to your MySQL user
  password: '', // change to your MySQL password
  database: 'solife',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

export async function pingDB() {
  const [rows] = await pool.query('SELECT 1 AS ok');
  return rows?.[0]?.ok === 1;
}

export async function getAllUsers() {
  const [rows] = await pool.query(
    'SELECT user_id, name, email FROM user ORDER BY user_id'
  );
  return rows;
}

export async function getUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT user_id, name, email, password FROM user WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

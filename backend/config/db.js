import mysql from 'mysql2';
// =======================
//  DATABASE CONFIG
// =======================
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: '', // kosongkan jika tanpa password
  database: 'solife',
});

export default db;

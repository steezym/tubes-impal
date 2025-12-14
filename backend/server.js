import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

import db from './config/db.js';
import upload from './config/multer.js';
import PostController from './Controllers/PostController.js';

dotenv.config();

const app = express();
const port = 4000;
const postController = new PostController();

app.use(cors());
app.use(express.json());
app.use(express.static('./images'));

// ======================================================
// EMAIL TRANSPORTER (GMAIL) — FIX TLS ERROR
// ======================================================
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // APP PASSWORD GMAIL
  },
  tls: {
    rejectUnauthorized: false, // ⬅️ FIX self-signed certificate
  },
});

// ======================================================
// CONNECT DATABASE
// ======================================================
db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log("✅ Connected to MySQL database 'solife'");
  }
});

// ======================================================
// CHECK USERNAME
// ======================================================
app.get('/auth/check-username', (req, res) => {
  const { name } = req.query;
  if (!name) return res.json({ exists: false });

  db.query(
    'SELECT 1 FROM user WHERE name=? LIMIT 1',
    [name],
    (err, rows) => {
      if (err) return res.json({ exists: false });
      res.json({ exists: rows.length > 0 });
    },
  );
});

// ======================================================
// LOGIN
// ======================================================
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  db.query('SELECT * FROM user WHERE email=?', [email], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (rows.length === 0 || rows[0].password !== password)
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      message: 'Login success',
      user: {
        id: rows[0].user_id,
        name: rows[0].name,
        email: rows[0].email,
      },
    });
  });
});

// ======================================================
// REGISTER
// ======================================================
app.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields required' });

  const check =
    'SELECT name,email FROM user WHERE email=? OR name=? LIMIT 1';

  db.query(check, [email, name], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (rows.length > 0) {
      if (rows[0].email === email)
        return res.status(409).json({ message: 'Email already registered' });
      if (rows[0].name === name)
        return res.status(409).json({ message: 'Username already registered' });
    }

    const user_id = 'U' + Date.now().toString().slice(-6);
    db.query(
      'INSERT INTO user (user_id,name,email,password) VALUES (?,?,?,?)',
      [user_id, name, email, password],
      err2 => {
        if (err2)
          return res.status(500).json({ message: 'Database error' });
        res.status(201).json({ message: 'Registration successful' });
      },
    );
  });
});

// ======================================================
// FORGOT PASSWORD — SEND OTP EMAIL (ANTI CRASH)
// ======================================================
app.post('/auth/forgot', (req, res) => {
  const { email } = req.body || {};
  const generic = { message: 'OTP has been sent to email' };

  if (!email) return res.json(generic);

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  const query =
    'UPDATE user SET reset_otp=?, reset_otp_expires_at=? WHERE email=?';

  db.query(query, [otp, expires, email], async (err, result) => {
    if (err) {
      console.error('DB ERROR /auth/forgot:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows > 0) {
      try {
        await mailer.sendMail({
          from: `"Solife App" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Reset Password OTP',
          html: `
            <h2>Password Reset</h2>
            <p>Kode OTP kamu:</p>
            <h1>${otp}</h1>
            <p>Berlaku 10 menit.</p>
          `,
        });
      } catch (mailErr) {
        console.error('EMAIL ERROR:', mailErr.message);
        // ❗ error email TIDAK mematikan server
      }
    }

    return res.json(generic);
  });
});

// ======================================================
// RESET PASSWORD
// ======================================================
app.post('/auth/reset', (req, res) => {
  const { email, otp, new_password } = req.body || {};
  if (!email || !otp || !new_password)
    return res.status(400).json({ message: 'All fields required' });

  const select =
    'SELECT reset_otp, reset_otp_expires_at FROM user WHERE email=?';

  db.query(select, [email], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (rows.length === 0)
      return res.status(401).json({ message: 'Invalid or expired OTP' });

    const row = rows[0];
    const expired =
      !row.reset_otp_expires_at ||
      new Date(row.reset_otp_expires_at) < new Date();

    if (expired || row.reset_otp !== otp)
      return res.status(401).json({ message: 'Invalid or expired OTP' });

    const update =
      'UPDATE user SET password=?, reset_otp=NULL, reset_otp_expires_at=NULL WHERE email=?';

    db.query(update, [new_password, email], err2 => {
      if (err2)
        return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Password has been reset successfully' });
    });
  });
});

// ======================================================
// POSTS (TETAP)
// ======================================================
app.get('/post', postController.getPost);
app.get('/post/user/:user_id', postController.getPostsUser);
app.get('/post/exclude/:user_id', postController.getPostsExcludingUser);
app.post('/post', upload.single('file'), postController.uploadPost);
app.patch('/post/:postId', upload.single('file'), postController.updatePost);
app.delete('/post/:postId', postController.deletePost);

// ======================================================
// START SERVER
// ======================================================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

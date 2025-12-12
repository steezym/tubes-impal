import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import Post from './Models/Post.js';
import upload from './config/multer.js';
import PostController from './Controllers/PostController.js';

const app = express();
const port = 4000;
const postController = new PostController();
app.use(express.static('./images'));

// connect ke database
db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log("✅ Connected to MySQL database 'solife'");
  }
});

app.use(cors());
app.use(express.json());

// ======================================================
//  CHECK USERNAME (untuk frontend cek dulu)
//  GET /auth/check-username?name=mazmur
// ======================================================
app.get('/auth/check-username', (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({
      exists: false,
      message: 'name is required',
    });
  }

  const query = 'SELECT 1 FROM user WHERE name = ? LIMIT 1';
  db.query(query, [name], (err, result) => {
    if (err) {
      console.error('DB error /auth/check-username:', err);
      return res.status(500).json({
        exists: false,
        message: 'Database error',
      });
    }

    if (result.length > 0) {
      return res.json({ exists: true });
    }

    return res.json({ exists: false });
  });
});

// ======================================================
//  LOGIN
// ======================================================
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  // validasi simple
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const query = 'SELECT * FROM user WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    // cek email & password
    if (result.length === 0 || result[0].password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // jika berhasil
    res.json({
      message: 'Login success',
      user: {
        id: result[0].user_id,
        name: result[0].name,
        email: result[0].email,
      },
    });
  });
});

// ======================================================
//  REGISTER
// ======================================================
app.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  // cek email ATAU username (name) sudah dipakai
  const checkQuery =
    'SELECT name, email FROM user WHERE email = ? OR name = ? LIMIT 1';
  db.query(checkQuery, [email, name], (err, result) => {
    if (err) {
      console.error('DB error /auth/register (check):', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length > 0) {
      const existing = result[0];

      if (existing.email === email) {
        return res.status(409).json({ message: 'Email is already registered' });
      }

      if (existing.name === name) {
        return res.status(409).json({ message: 'Username already registered' });
      }

      // fallback (harusnya nggak kena)
      return res.status(409).json({ message: 'Already registered' });
    }

    const user_id = 'U' + Date.now().toString().slice(-6);
    const insertQuery =
      'INSERT INTO user (user_id, name, email, password) VALUES (?, ?, ?, ?)';

    db.query(insertQuery, [user_id, name, email, password], err2 => {
      if (err2) {
        console.error('DB error /auth/register (insert):', err2);
        return res.status(500).json({ message: 'Database error' });
      }

      res.status(201).json({
        message: 'Registration successful',
        user: { name, email },
      });
    });
  });
});

// ======================================================
//  FORGOT PASSWORD (LOCAL OTP)
// ======================================================
app.post('/auth/forgot', (req, res) => {
  const { email } = req.body || {};
  console.log('📩 Hit /auth/forgot:', req.body);

  const generic = {
    message: 'OTP has been sent',
  };

  if (!email) return res.status(200).json(generic);

  // generate 6 digit OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + 10 * 60 * 1000); // expire 10 menit

  const query =
    'UPDATE user SET reset_otp=?, reset_otp_expires_at=? WHERE email=?';

  db.query(query, [otp, expires, email], (err, result) => {
    if (err) {
      console.error('❌ DB error /auth/forgot:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows > 0) {
      console.log(`🔐 OTP for ${email}: ${otp} (valid 10 minutes)`);
    } else {
      console.log(`⚠️ Email not found but responding generic: ${email}`);
    }

    return res.status(200).json(generic);
  });
});
// ======================================================
//  RESET PASSWORD (cek OTP + ganti password baru)
// ======================================================
app.post('/auth/reset', (req, res) => {
  const { email, otp, new_password } = req.body || {};
  console.log('📩 Hit /auth/reset:', req.body);

  if (!email || !otp || !new_password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const selectQuery =
    'SELECT reset_otp, reset_otp_expires_at FROM user WHERE email = ?';

  db.query(selectQuery, [email], (err, rows) => {
    if (err) {
      console.error('❌ DB error /auth/reset (select):', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    const row = rows[0];
    const expired =
      !row.reset_otp_expires_at ||
      new Date(row.reset_otp_expires_at) < new Date();

    if (expired || row.reset_otp !== otp) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    const updateQuery =
      'UPDATE user SET password = ?, reset_otp = NULL, reset_otp_expires_at = NULL WHERE email = ?';

    db.query(updateQuery, [new_password, email], err2 => {
      if (err2) {
        console.error('❌ DB error /auth/reset (update):', err2);
        return res.status(500).json({ message: 'Server error' });
      }

      return res.json({
        message: 'Password has been reset successfully.',
      });
    });
  });
});

// ======================================================
//  GET ALL POSTS
// ======================================================
app.get('/post', postController.getPost);

// ======================================================
//  GET ALL POSTS BY USER ID
// ======================================================

app.get('/post/user/:user_id', postController.getPostsUser);

// ======================================================
//  GET ALL POSTS OTHER EXCEPT USER
// ======================================================

app.get('/post/exclude/:user_id', postController.getPostsExcludingUser);

// ======================================================
//  ADD A POST
// ======================================================

app.post('/post', upload.single('file'), postController.uploadPost);

// ======================================================
//  UPDATE A POST
// ======================================================

app.patch('/post/:postId', upload.single('file'), postController.updatePost);

// ======================================================
//  DELETE A POST
// ======================================================

app.delete('/post/:postId', postController.deletePost);

// ======================================================
//  START SERVER
// ======================================================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

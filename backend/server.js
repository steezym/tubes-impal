import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import Post from './Models/Post.js';
import upload from './config/multer.js';
import Chat from './Models/Chat.js';
import Alert from './Models/Alert.js';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const port = 4000;

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

  const checkQuery = 'SELECT * FROM user WHERE email = ?';
  db.query(checkQuery, [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (result.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const user_id = 'U' + Date.now().toString().slice(-6);
    const insertQuery =
      'INSERT INTO user (user_id, name, email, password) VALUES (?, ?, ?, ?)';

    db.query(insertQuery, [user_id, name, email, password], err2 => {
      if (err2) return res.status(500).json({ message: 'Database error' });

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

app.get('/post', async (req, res) => {
  try {
    const post = new Post();
    const data = (await post.getPost())[0];
    res.status(200).json({
      status: 'success',
      length: data.length,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// ======================================================
//  GET ALL POSTS BY USER ID
// ======================================================

app.get('/post/:user_id', async (req, res) => {
  try {
    const userId = req.params.user_id;
    const post = new Post();
    const data = (await post.getPostByUserId(userId))[0];
    res.status(200).json({
      status: 'success',
      length: data.length,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// ======================================================
//  GET ALL POSTS OTHER EXCEPT USER
// ======================================================

app.get('/post/exclude/:user_id', async (req, res) => {
  try {
    const userId = req.params.user_id;
    const post = new Post();
    const data = (await post.getPostByUserExclusion(userId))[0];
    res.status(200).json({
      status: 'success',
      length: data.length,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// ======================================================
//  ADD A POST
// ======================================================

app.post('/post', upload.single('file'), async (req, res) => {
  try {
    const post_id = 'P' + Date.now().toString().slice(-6);
    const post = new Post(
      post_id,
      req.body.content,
      req.file?.filename,
      req.body.timestamp,
      req.body.user_id,
    );

    await post.createPost();
    res.status(200).json({
      status: 'success',
      message: 'Post successfully posted!',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// ======================================================
//  UPDATE A POST
// ======================================================

app.patch('/post/:postId', upload.single('file'), async (req, res) => {
  try {
    const post = new Post();
    const getPost = (await post.getPostById(req.params.postId))[0][0];

    if (!getPost) {
      throw new Error('Post not found!');
    } else {
      const newPost = new Post(
        getPost.post_id,
        req.body?.content ? req.body.content : getPost.content,
        req.file?.filename ? req.file.filename : getPost.file,
        '',
        '',
      );
      await newPost.editPost();
    }

    res.status(201).json({
      status: 'success',
      message: 'Post updated successfully!',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// ======================================================
//  DELETE A POST
// ======================================================

app.delete('/post/:postId', async (req, res) => {
  try {
    const post = new Post(req.params.postId, '', '', '', '');
    const deletePost = await post.deletePost();
    res.status(204).json({});
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// ======================================================
//  GET CHAT HISTORY
// ======================================================

app.get("/chat", async (req, res) => {
  try {
    const { userA, userB } = req.query;
    const result = await Chat.getChats(userA, userB);
    res.json({ data: result });
  } catch (e) {
    console.error("GET /chat error:", e);
    res.status(500).json({ error: e.message });
  }
});

// ======================================================
//  INSERT NEW CHAT MESSAGE
// ======================================================

app.post("/chat", async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body;
    const chat_id = "C" + uuidv4().slice(0, 8).toUpperCase();

    const chat = new Chat(chat_id, sender_id, receiver_id, message, new Date());
    await chat.insertChat();

    const savedMsg = {
      chat_id,
      sender_id,
      receiver_id,
      message,
      timeStamp: new Date(),
    };

    io.emit("new_message", savedMsg);

    res.json(savedMsg);

  } catch (e) {
    console.error("POST /chat error:", e);
    res.status(500).json({ error: e.message });
  }
});


// ======================================================
//  GET RECENT CHATS
// ======================================================

app.get("/recent-chats", async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const result = await Chat.getRecentChats(user_id); // STATIC
    res.json({ data: result });
  } catch (e) {
    console.error("GET /recent-chats error:", e);
    res.status(500).json({ error: e.message });
  }
});

// ======================================================
//  INSERT ALERT
// ======================================================
app.post("/alert", async (req, res) => {
  try {
    const { user_id, message } = req.body;
    const alert_id = "A" + Date.now().toString().slice(-6);

    const alert = new Alert(alert_id, user_id, message, new Date());
    await alert.insertAlert();

    res.json({ status: "success", alert_id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
//  GET ALERTS BY USER
// ======================================================
app.get("/alert/:user_id", async (req, res) => {
  try {
    const [rows] = await Alert.getAlertByUser(req.params.user_id);
    res.json({ status: "success", data: rows });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
//  SOCKET.IO SERVER
// ======================================================
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

// optional untuk lihat client connect
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

// ======================================================
//  START SERVER (gunakan httpServer, BUKAN app.listen)
// ======================================================
httpServer.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});


import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
const port = 4000;

// =======================
//  DATABASE CONFIG
// =======================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",     // Your MySQL username
  password: "",     // kosongkan jika tanpa password
  database: "solife"
});

// connect ke database
db.connect(err => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database 'solife'");
  }
});

app.use(cors());
app.use(express.json());

// ======================================================
//  LOGIN
// ======================================================
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  // validasi simple
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }

  const query = "SELECT * FROM user WHERE email = ?";
  db.query(query, [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    // cek email & password
    if (result.length === 0 || result[0].password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // jika berhasil
    res.json({
      message: "Login success",
      user: {
        id: result[0].user_id,
        name: result[0].name,
        email: result[0].email
      }
    });
  });
});

// ======================================================
//  REGISTER
// ======================================================
app.post("/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const checkQuery = "SELECT * FROM user WHERE email = ?";
  db.query(checkQuery, [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.length > 0) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const user_id = "U" + Date.now().toString().slice(-6);
    const insertQuery =
      "INSERT INTO user (user_id, name, email, password) VALUES (?, ?, ?, ?)";

    db.query(insertQuery, [user_id, name, email, password], err2 => {
      if (err2) return res.status(500).json({ message: "Database error" });

      res.status(201).json({
        message: "Registration successful",
        user: { name, email }
      });
    });
  });
});

// ======================================================
//  FORGOT PASSWORD (LOCAL OTP)
// ======================================================
app.post("/auth/forgot", (req, res) => {
  const { email } = req.body || {};
  console.log("📩 Hit /auth/forgot:", req.body);

  const generic = {
    message: "OTP has been sent"
  };

  if (!email) return res.status(200).json(generic);

  // generate 6 digit OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + 10 * 60 * 1000); // expire 10 menit

  const query =
    "UPDATE user SET reset_otp=?, reset_otp_expires_at=? WHERE email=?";

  db.query(query, [otp, expires, email], (err, result) => {
    if (err) {
      console.error("❌ DB error /auth/forgot:", err);
      return res.status(500).json({ message: "Database error" });
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
app.post("/auth/reset", (req, res) => {
  const { email, otp, new_password } = req.body || {};
  console.log("📩 Hit /auth/reset:", req.body);

  if (!email || !otp || !new_password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const selectQuery =
    "SELECT reset_otp, reset_otp_expires_at FROM user WHERE email = ?";

  db.query(selectQuery, [email], (err, rows) => {
    if (err) {
      console.error("❌ DB error /auth/reset (select):", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const row = rows[0];
    const expired =
      !row.reset_otp_expires_at ||
      new Date(row.reset_otp_expires_at) < new Date();

    if (expired || row.reset_otp !== otp) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const updateQuery =
      "UPDATE user SET password = ?, reset_otp = NULL, reset_otp_expires_at = NULL WHERE email = ?";

    db.query(updateQuery, [new_password, email], err2 => {
      if (err2) {
        console.error("❌ DB error /auth/reset (update):", err2);
        return res.status(500).json({ message: "Server error" });
      }

      return res.json({
        message: "Password has been reset successfully."
      });
    });
  });
});

// ======================================================
//  START SERVER
// ======================================================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

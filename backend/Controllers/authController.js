const crypto = require("crypto");
const sendOTP = require("../utils/mailer");

// SIMPAN OTP SEMENTARA (UNTUK TUGAS)
const otpStore = {}; // { email: { otp, expires } }

// ========== SEND OTP ==========
exports.forgotPassword = async (req, res) => {
  const email = req.body.email?.toLowerCase().trim();
  if (!email) return res.status(400).json({ message: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000;

  otpStore[email] = { otp, expires };

  await sendOTP(email, otp);
  res.json({ message: "OTP sent to email" });
};

// ========== RESET PASSWORD ==========
exports.resetPassword = async (req, res) => {
  const { email, otp, new_password } = req.body;
  const record = otpStore[email];

  if (!record) return res.status(400).json({ message: "OTP not found" });
  if (record.expires < Date.now())
    return res.status(400).json({ message: "OTP expired" });
  if (record.otp !== otp)
    return res.status(400).json({ message: "OTP invalid" });

  // TODO: update password user di DB (hash dulu!)
  delete otpStore[email];

  res.json({ message: "Password reset success" });
};

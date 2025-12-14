const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: `"Solife App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "OTP Reset Password",
    text: `Kode OTP kamu: ${otp} (berlaku 5 menit)`,
  });
}

module.exports = sendOTP;

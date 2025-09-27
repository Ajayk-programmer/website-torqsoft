const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let otpStore = {}; // { email: otp }

// configure gmail smtp
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourmail@gmail.com",   // your Gmail
    pass: "your-app-password"     // use Gmail App Password, not your normal password
  }
});

// send otp
app.post("/send-otp", (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit OTP
  otpStore[email] = otp;

  const mailOptions = {
    from: "yourmail@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) return res.status(500).send("Error sending OTP");
    res.send("OTP sent successfully!");
  });
});

// verify otp
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email];
    return res.send("✅ Email verified!");
  }
  res.status(400).send("❌ Invalid OTP");
});

app.listen(5000, () => console.log("Server running on port 5000"));

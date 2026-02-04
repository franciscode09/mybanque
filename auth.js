import { users, otps } from "./db.js";
import { sendOTP } from "./mailer.js";
import { v4 as uuid } from "uuid";

export async function login(req, res) {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ error: "Identifiants invalides" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps[email] = otp;

  await sendOTP(email, otp);
  res.json({ message: "OTP envoyé" });
}

export function verifyOTP(req, res) {
  const { email, otp } = req.body;

  if (otps[email] !== otp) {
    return res.status(401).json({ error: "OTP invalide" });
  }

  delete otps[email];
  const token = uuid();
  res.json({ token });
}

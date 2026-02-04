import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "TON_EMAIL@gmail.com",
    pass: "MOT_DE_PASSE_APPLICATION_GMAIL"
  }
});

export function sendOTP(email, otp) {
  return transporter.sendMail({
    from: "NeoBank <neobank@gmail.com>",
    to: email,
    subject: "Votre code de sécurité NeoBank",
    text: `Votre code OTP est : ${otp}`
  });
}

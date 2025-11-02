import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
console.log("SMTP_PASSWORD:", !!process.env.SMTP_PASSWORD); // log if password is set (true/false)


const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD as string,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error verifying transporter:", error);
  } else {
    console.log("Server is ready to take messages:", success);
  }
});

export async function sendOTPEmail(to: string, otp: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: "Your OTP Verification Code",
      html: `<p>Your OTP is: <b>${otp}</b></p><p>This code is valid for 10 minutes.</p>`,
    });
    console.log("Email sent successfully:", info);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

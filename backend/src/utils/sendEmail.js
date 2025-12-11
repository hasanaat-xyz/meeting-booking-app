// utils/sendEmail.js

import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    // ... (Your existing config)
    host: "smtp.resend.com",
    port: 587,
    secure: false,
    auth: {
      user: "resend", // static value
      pass: process.env.RESEND_API_KEY
    }
  });

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${to}. Message ID: ${info.messageId}`);
    return info; // Optionally return the result
  } catch (error) {
    // This will print the detailed error from Resend/Nodemailer!
    console.error(`ERROR: Failed to send email to ${to}:`, error.message);
  }
};
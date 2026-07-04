const nodemailer = require("nodemailer");

let transporter = null;
const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

if (smtpConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

/**
 * Sends an email if SMTP is configured in .env.
 * Falls back to logging the content to the console so the app is
 * still usable in local/dev environments without real SMTP credentials.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  if (!smtpConfigured) {
    console.log("📧 [DEV MODE — no SMTP configured] Email not actually sent.");
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Content: ${text || html}`);
    return { devMode: true };
  }

  return transporter.sendMail({
    from: `"MenStyle Pro" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
};

module.exports = sendEmail;

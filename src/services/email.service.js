require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"backend-ledger" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendRegisterEmail = async (userName, name) => {
  const subject = 'Welcome to backend-ledger!';
  const text = `Hi ${name},\n\nThank you for registering with backend-ledger. We're excited to have you on board!\n\nBest regards,\nThe backend-ledger Team`;
  const html = `<p>Hi ${name},</p><p>Thank you for registering with backend-ledger. We're excited to have you on board!</p><p>Best regards,<br>The backend-ledger Team</p>`;

  await sendEmail(userName, subject, text, html);
};

module.exports = { transporter, sendEmail, sendRegisterEmail };
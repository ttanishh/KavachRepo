import nodemailer from 'nodemailer';

/**
 * Initialize the Nodemailer transporter
 * @returns {Object} Nodemailer transporter instance
 */
const initTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', 
    auth: {
      user: process.env.SMTP_USER, // SMTP username
      pass: process.env.SMTP_PASS, // SMTP password
    },
  });

  return transporter;
};

/**
 * Send an email using Nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text email content
 * @param {string} [html] - Optional HTML email content
 * @returns {Promise<Object>} Result object with success status
 */
export const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = initTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM, // Sender address (e.g., "no-reply@kavach.com")
      to,
      subject,
      text,
      ...(html && { html }), // Include HTML content if provided
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
};
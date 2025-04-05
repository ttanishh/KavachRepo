/**
 * Send an email
 * This is a mock implementation for development
 * 
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email content
 * @returns {Promise<Object>} Result object
 */
export const sendEmail = async (to, subject, body) => {
  console.log(`[EMAIL MOCK] Sending email to: ${to}`);
  console.log(`[EMAIL MOCK] Subject: ${subject}`);
  console.log(`[EMAIL MOCK] Body: ${body}`);
  
  return {
    success: true,
    messageId: `mock-${Date.now()}`
  };
};

/**
 * Send a welcome email to a new user
 * 
 * @param {string} to - Recipient email address
 * @param {string} name - User's name
 * @returns {Promise<Object>} Result object
 */
export const sendWelcomeEmail = async (to, name) => {
  const subject = 'Welcome to Kavach';
  const body = `Hello ${name || 'there'},\n\nWelcome to Kavach! We're glad to have you on board.\n\nRegards,\nThe Kavach Team`;
  
  return sendEmail(to, subject, body);
};

/**
 * Send a verification code via email
 * 
 * @param {string} to - Recipient email address
 * @param {string} code - Verification code
 * @returns {Promise<Object>} Result object
 */
export const sendVerificationCode = async (to, code) => {
  const subject = 'Your Kavach Verification Code';
  const body = `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`;
  
  return sendEmail(to, subject, body);
};
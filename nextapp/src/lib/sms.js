// Initialize Twilio client
let twilioClient;

/**
 * Initialize the Twilio client (called once on server startup)
 * @returns {Object} Twilio client instance
 */
const initTwilioClient = () => {
  // Only initialize if we haven't already
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (!accountSid || !authToken) {
      console.error('Twilio credentials not found in environment variables');
      return null;
    }
    
    // Import Twilio SDK (only on server-side)
    const twilio = require('twilio');
    twilioClient = twilio(accountSid, authToken);
  }
  
  return twilioClient;
};

/**
 * Send an SMS message using Twilio
 * @param {string} to - Recipient phone number (format: +1234567890)
 * @param {string} body - Message content
 * @returns {Promise<Object>} Twilio message object or error
 */
export const sendSMS = async (to, body) => {
  try {
    const client = initTwilioClient();
    
    if (!client) {
      throw new Error('Twilio client not initialized');
    }
    
    const from = process.env.TWILIO_PHONE_NUMBER;
    if (!from) {
      throw new Error('Twilio phone number not found in environment variables');
    }
    
    // Format the phone number if needed
    const formattedTo = to.startsWith('+') ? to : `+${to}`;
    
    // Send the message
    const message = await client.messages.create({
      body,
      from,
      to: formattedTo
    });
    
    console.log(`SMS sent successfully. SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send SMS' 
    };
  }
};

/**
 * Send verification code via SMS
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} code - Verification code
 * @returns {Promise<Object>} Result object with success status
 */
export const sendVerificationCode = async (phoneNumber, code) => {
  const message = `Your Kavach verification code is: ${code}. This code will expire in 10 minutes.`;
  return sendSMS(phoneNumber, message);
};

/**
 * Send crime report notification
 * @param {string} phoneNumber - Recipient phone number 
 * @param {string} reportId - Crime report ID
 * @returns {Promise<Object>} Result object with success status
 */
export const sendReportNotification = async (phoneNumber, reportId) => {
  const message = `Your crime report (ID: ${reportId}) has been received. An officer will review it shortly. Thank you for using Kavach.`;
  return sendSMS(phoneNumber, message);
};

/**
 * Send status update notification
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} reportId - Crime report ID
 * @param {string} status - New status of the report
 * @returns {Promise<Object>} Result object with success status
 */
export const sendStatusUpdateNotification = async (phoneNumber, reportId, status) => {
  const statusMap = {
    'in_review': 'under review',
    'assigned': 'assigned to an officer',
    'resolved': 'resolved',
    'closed': 'closed'
  };
  
  const readableStatus = statusMap[status] || status;
  const message = `Update on your crime report (ID: ${reportId}): Your report is now ${readableStatus}. For more details, please check the Kavach app.`;
  
  return sendSMS(phoneNumber, message);
};
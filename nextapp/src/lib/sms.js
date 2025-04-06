// Initialize Twilio client
let twilioClient;

/**
 * Initialize the Twilio client
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
    
    try {
      // Import Twilio SDK
      const twilio = require('twilio');
      twilioClient = twilio(accountSid, authToken);
      console.log('Twilio client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Twilio client:', error);
      return null;
    }
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
    // Validate parameters
    if (!to) {
      throw new Error('Phone number is required');
    }
    
    if (!body) {
      throw new Error('Message body is required');
    }
    
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
    
    // Send the message - always send the real SMS
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
 * Send emergency OTP for authentication
 * @param {string} phoneNumber - Phone number to send OTP to
 * @param {string} otp - OTP code to send
 * @returns {Promise<Object>} Result object with success status
 */
export const sendEmergencyOTP = async (phoneNumber, otp) => {
  if (!phoneNumber) {
    console.error('Phone number is required for sending OTP');
    return { 
      success: false, 
      error: 'Phone number is required',
    };
  }
  
  if (!otp) {
    console.error('OTP is required for sending');
    return { 
      success: false, 
      error: 'OTP is required',
    };
  }
  
  console.log(`Sending emergency OTP ${otp} to ${phoneNumber}`);
  
  const message = `EMERGENCY: Your Kavach verification code is: ${otp}. This code will expire in 10 minutes.`;
  const result = await sendSMS(phoneNumber, message);
  
  return {
    ...result,
    phoneNumber
  };
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
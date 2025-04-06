// Since twilio is not installed yet, we'll implement a mock version
// Run 'npm install twilio' to use the actual Twilio service

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTPs temporarily (in a real app, you'd use Redis or a database)
const otpStore = new Map();

export const smsOtpService = {
  // Send OTP to the provided phone number
  async sendOTP(phoneNumber) {
    try {
      // Generate a new OTP
      const otp = generateOTP();
      
      // Store the OTP with an expiration time (5 minutes)
      otpStore.set(phoneNumber, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });
      
      // Mock sending the OTP (we're not using Twilio yet)
      console.log(`Mock SMS to ${phoneNumber}: Your Kavach verification code is: ${otp}. Valid for 5 minutes.`);
      
      return { success: true, message: 'OTP sent successfully', otp }; // Return OTP in development
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to send OTP' 
      };
    }
  },
  
  // Store OTP with contact information and expiration
  async storeOTP({ phone, email, otp, expiresAt }) {
    try {
      // If no OTP is provided, generate a new one
      if (!otp) {
        otp = generateOTP();
      }
      
      // If no expiresAt is provided, set default expiration to 10 minutes
      if (!expiresAt) {
        expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      }
      
      // Use phone as the key if available, otherwise use email
      const key = phone || email;
      
      if (!key) {
        throw new Error('Either phone or email must be provided');
      }
      
      otpStore.set(key, {
        otp,
        phone,
        email,
        expiresAt,
      });
      
      return { 
        success: true, 
        message: 'OTP stored successfully',
        otp, // Return OTP in development
      };
    } catch (error) {
      console.error('Error storing OTP:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to store OTP' 
      };
    }
  },
  
  // Send SMS with the OTP
  async sendSMS(phoneNumber, message) {
    try {
      // For development, just log the message
      console.log(`[SMS to ${phoneNumber}]: ${message}`);
      
      // Here you would use Twilio in production
      // In a real implementation with Twilio installed:
      // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      // await client.messages.create({
      //   body: message,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: phoneNumber
      // });
      
      return { success: true, message: 'SMS sent successfully' };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to send SMS' 
      };
    }
  },
  
  // Send Email with the OTP
  async sendEmail(to, { subject, text, html }) {
    try {
      // For development, just log the email
      console.log(`[Email to ${to}]: ${subject}`);
      console.log(text || html);
      
      // Here you would use Nodemailer in production
      // In a real implementation:
      // const transporter = nodemailer.createTransport({...});
      // await transporter.sendMail({
      //   from: process.env.SMTP_FROM,
      //   to,
      //   subject,
      //   text,
      //   html
      // });
      
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Error sending email:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to send email' 
      };
    }
  },
  
  // Verify the OTP provided by the user
  verifyOTP(identifier, userProvidedOTP) {
    const otpData = otpStore.get(identifier);
    
    // Check if OTP exists and is not expired
    if (!otpData) {
      return { success: false, message: 'No OTP found. Request a new one.' };
    }
    
    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(identifier); // Clean up expired OTP
      return { success: false, message: 'OTP has expired. Request a new one.' };
    }
    
    // Check if OTP matches
    if (otpData.otp === userProvidedOTP) {
      otpStore.delete(identifier); // Clean up used OTP
      return { success: true, message: 'OTP verified successfully' };
    }
    
    return { success: false, message: 'Invalid OTP. Please try again.' };
  }
};

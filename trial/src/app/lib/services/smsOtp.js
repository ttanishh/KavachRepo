import twilio from 'twilio';
import { db } from '../firebase';
import { doc, collection, setDoc, getDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import nodemailer from 'nodemailer';

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// OTP collection reference
const otpsCollection = collection(db, 'otps');

export const smsOtpService = {
  // Store OTP in Firestore
  async storeOTP({ phone, email, otp, expiresAt }) {
    const otpId = phone || email;
    
    if (!otpId) {
      throw new Error('Phone or email is required');
    }
    
    const otpData = {
      otp,
      expiresAt: Timestamp.fromDate(expiresAt),
      createdAt: serverTimestamp(),
      phone: phone || null,
      email: email || null,
      attempts: 0
    };
    
    await setDoc(doc(otpsCollection, otpId), otpData);
    return otpData;
  },
  
  // Verify OTP
  async verifyOTP({ phone, email, otp }) {
    const otpId = phone || email;
    
    if (!otpId || !otp) {
      return false;
    }
    
    const otpRef = doc(otpsCollection, otpId);
    const otpDoc = await getDoc(otpRef);
    
    if (!otpDoc.exists()) {
      return false;
    }
    
    const otpData = otpDoc.data();
    
    // Update attempts count
    await setDoc(otpRef, {
      ...otpData,
      attempts: (otpData.attempts || 0) + 1
    }, { merge: true });
    
    // Check if OTP is expired
    const now = new Date();
    const expiresAt = otpData.expiresAt.toDate();
    
    if (now > expiresAt) {
      return false;
    }
    
    // Check if OTP matches
    return otpData.otp === otp;
  },
  
  // Delete OTP
  async deleteOTP({ phone, email }) {
    const otpId = phone || email;
    
    if (!otpId) {
      return false;
    }
    
    await deleteDoc(doc(otpsCollection, otpId));
    return true;
  },
  
  // Send SMS via Twilio
  async sendSMS(phoneNumber, message) {
    try {
      // For development, just log the message
      if (process.env.NODE_ENV === 'development') {
        console.log(`[SMS to ${phoneNumber}]: ${message}`);
        return true;
      }
      
      const result = await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      
      return result;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  },
  
  // Send Email
  async sendEmail(to, { subject, text, html }) {
    try {
      // For development, just log the email
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Email to ${to}]: ${subject}`);
        console.log(text || html);
        return true;
      }
      
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        text,
        html
      });
      
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
};

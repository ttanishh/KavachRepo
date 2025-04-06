import { NextResponse } from 'next/server';
import { smsOtpService } from '@/lib/services/smsOtp';

export async function POST(request) {
  try {
    const { phone, email } = await request.json();

    // Validate input
    if (!phone && !email) {
      return NextResponse.json(
        { message: 'Phone number or email is required' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 10-minute expiration
    await smsOtpService.storeOTP({
      phone,
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTP via SMS if phone is provided
    if (phone) {
      await smsOtpService.sendSMS(phone, `Your Kavach verification code is: ${otp}`);
    }

    // Send OTP via email if email is provided
    if (email) {
      await smsOtpService.sendEmail(email, {
        subject: 'Kavach Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0ea5e9;">Kavach Verification Code</h2>
            <p>Your verification code is:</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; color: #333; background: #f0f9ff; padding: 10px; display: inline-block; border-radius: 4px;">${otp}</h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <p>Thank you,<br>Kavach Security Team</p>
          </div>
        `
      });
    }

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { message: 'Failed to send OTP', error: error.message },
      { status: 500 }
    );
  }
}

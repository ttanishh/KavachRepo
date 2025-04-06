import { NextResponse } from 'next/server';
import { smsOtpService } from '@/lib/services/smsOtp';

export async function POST(request) {
  try {
    const { phone, email, otp } = await request.json();

    // Validate input
    if ((!phone && !email) || !otp) {
      return NextResponse.json(
        { message: 'Phone/email and OTP are required' },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = await smsOtpService.verifyOTP({ phone, email, otp });

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Delete OTP after successful verification
    await smsOtpService.deleteOTP({ phone, email });

    return NextResponse.json(
      { message: 'OTP verified successfully', verified: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { message: 'Failed to verify OTP', error: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { sendSMS } from '@/lib/sms';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phoneNumber, message } = body;

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { success: false, error: 'Phone number and message are required.' },
        { status: 400 }
      );
    }

    const result = await sendSMS(phoneNumber, message);

    if (result.success) {
      return NextResponse.json({ success: true, sid: result.sid }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
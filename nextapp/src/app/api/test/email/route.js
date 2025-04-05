import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, subject, text, html } = body;

    // Validate required fields
    if (!to || !subject || !text) {
      return NextResponse.json(
        { success: false, error: 'Recipient email, subject, and text content are required.' },
        { status: 400 }
      );
    }

    // Send the email
    const result = await sendEmail(to, subject, text, html);

    if (result.success) {
      return NextResponse.json({ success: true, messageId: result.messageId }, { status: 200 });
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
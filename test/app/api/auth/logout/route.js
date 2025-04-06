import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Delete the auth token cookie
    const cookieStore = cookies();
    cookieStore.delete('auth_token');

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { message: 'Failed to logout', error: error.message },
      { status: 500 }
    );
  }
}

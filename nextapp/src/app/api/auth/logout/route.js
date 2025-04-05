import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear the authentication token cookie
    const cookieStore = cookies();
    cookieStore.delete('token');
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to log out' },
      { status: 500 }
    );
  }
}
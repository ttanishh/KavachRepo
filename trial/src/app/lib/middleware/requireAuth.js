import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { authService } from '../services/auth';

export async function requireAuth(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return {
        success: false,
        error: 'Authentication required',
        status: 401
      };
    }

    const user = await authService.verifyToken(token);
    
    if (!user) {
      return {
        success: false,
        error: 'Invalid or expired token',
        status: 401
      };
    }

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      status: 500
    };
  }
}

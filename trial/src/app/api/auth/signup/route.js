import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/services/auth';
import { usersService } from '@/lib/services/users';

export async function POST(request) {
  try {
    const { uid, fullName, email, phone } = await request.json();

    // Validate input
    if (!uid || !fullName || !email) {
      return NextResponse.json(
        { message: 'UID, full name, and email are required' },
        { status: 400 }
      );
    }

    // Create user in database
    const user = await usersService.createUser({
      uid,
      fullName,
      email,
      phone,
      role: 'user', // Default role
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Generate JWT token
    const token = authService.generateToken({
      uid: user.uid,
      email: user.email,
      role: user.role,
    });

    // Set auth token in HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          uid: user.uid,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Failed to create user', error: error.message },
      { status: 500 }
    );
  }
}

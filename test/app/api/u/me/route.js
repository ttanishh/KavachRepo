import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/services/auth';
import { usersService } from '@/lib/services/users';

export async function GET() {
  try {
    // Get the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = await authService.verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Get user data
    const user = await usersService.getUserById(decoded.uid);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      uid: user.uid,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      photoURL: user.photoURL,
      address: user.address,
      createdAt: user.createdAt,
    }, { status: 200 });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return NextResponse.json(
      { message: 'Failed to get user profile', error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    // Get the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = await authService.verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Get request data
    const { fullName, phone, address, photoURL } = await request.json();
    
    // Update user
    const updatedUser = await usersService.updateUser(decoded.uid, {
      fullName,
      phone,
      address,
      photoURL,
      updatedAt: new Date()
    });
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        uid: updatedUser.uid,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        photoURL: updatedUser.photoURL,
        address: updatedUser.address,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: 'Failed to update profile', error: error.message },
      { status: 500 }
    );
  }
}

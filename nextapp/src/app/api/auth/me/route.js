import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { db } from '@/lib/firebase';
import { userDoc } from '@/models/User';
import { adminDoc } from '@/models/Admin';
import { superAdminDoc } from '@/models/SuperAdmin';

export async function GET(request) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = await verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Fetch user data based on role
    let userData;
    
    switch (decoded.role) {
      case 'user':
        const userDocRef = userDoc(db, decoded.userId);
        const userSnapshot = await userDocRef.get();
        
        if (!userSnapshot.exists()) {
          return NextResponse.json(
            { success: false, error: 'User not found' },
            { status: 404 }
          );
        }
        
        userData = {
          id: userSnapshot.id,
          ...userSnapshot.data(),
          role: 'user'
        };
        break;
        
      case 'admin':
        const adminDocRef = adminDoc(db, decoded.userId);
        const adminSnapshot = await adminDocRef.get();
        
        if (!adminSnapshot.exists()) {
          return NextResponse.json(
            { success: false, error: 'Admin not found' },
            { status: 404 }
          );
        }
        
        userData = {
          id: adminSnapshot.id,
          ...adminSnapshot.data(),
          role: 'admin'
        };
        break;
        
      case 'superAdmin':
        const superAdminDocRef = superAdminDoc(db, decoded.userId);
        const superAdminSnapshot = await superAdminDocRef.get();
        
        if (!superAdminSnapshot.exists()) {
          return NextResponse.json(
            { success: false, error: 'Super Admin not found' },
            { status: 404 }
          );
        }
        
        userData = {
          id: superAdminSnapshot.id,
          ...superAdminSnapshot.data(),
          role: 'superAdmin'
        };
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid user role' },
          { status: 400 }
        );
    }
    
    // Remove sensitive data
    if (userData.password) delete userData.password;
    
    return NextResponse.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get user data' },
      { status: 500 }
    );
  }
}
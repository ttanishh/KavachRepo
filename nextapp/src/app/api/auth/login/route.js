import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/firebase';
import { userDoc } from '@/models/User';
import { adminDoc } from '@/models/Admin';
import { superAdminDoc } from '@/models/SuperAdmin';
import { collection, getDocs, query, where } from '@/lib/firebase';

export async function POST(request) {
  try {
    const { 
      email, 
      password, 
      role = 'user',
      isEmergencyLogin = false // Special flag for emergency login
    } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    let userData;
    let docRef;

    // Handle different roles
    switch (role) {
      case 'user':
        docRef = userDoc(db, email);
        userData = await docRef.get();
        
        if (!userData.exists) {
          // If this is an emergency login attempt and the user doesn't exist,
          // we could redirect to emergency signup instead of showing an error
          if (isEmergencyLogin) {
            return NextResponse.json({
              success: false,
              error: 'Account not found',
              shouldCreateEmergencyAccount: true
            }, { status: 404 });
          }
          
          return NextResponse.json(
            { success: false, error: 'Invalid email or password' },
            { status: 401 }
          );
        }
        
        const user = userData.data();
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return NextResponse.json(
            { success: false, error: 'Invalid email or password' },
            { status: 401 }
          );
        }
        
        // For emergency login, set a special session flag
        // This could trigger different app behavior or restrictions
        const sessionData = {
          userId: userData.id,
          email: user.email,
          username: user.username,
          role: 'user',
          isEmergencyLogin: isEmergencyLogin || false,
          isEmergencyUser: user.isEmergencyUser || false
        };
        
        // Update last login time
        await docRef.update({
          lastLogin: new Date()
        });
        
        return NextResponse.json({
          success: true,
          user: {
            id: userData.id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            isEmergencyUser: user.isEmergencyUser
          },
          isEmergencyLogin,
          token: "jwt_token_would_go_here" // In a real app, generate a JWT
        });
        
      // Admin and SuperAdmin login cases...
      case 'admin':
        // Admin login logic
        docRef = adminDoc(db, email);
        userData = await docRef.get();
        
        if (!userData.exists) {
          return NextResponse.json(
            { success: false, error: 'Invalid email or password' },
            { status: 401 }
          );
        }
        
        // Admin-specific logic...
        break;
        
      case 'superAdmin':
        // SuperAdmin login logic
        docRef = superAdminDoc(db, email);
        userData = await docRef.get();
        
        if (!userData.exists) {
          return NextResponse.json(
            { success: false, error: 'Invalid email or password' },
            { status: 401 }
          );
        }
        
        // SuperAdmin-specific logic...
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid role specified' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
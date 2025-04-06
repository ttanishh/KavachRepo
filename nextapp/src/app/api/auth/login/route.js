import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, getDoc } from '@/lib/firebase';  // Use @ alias
import { userDoc, users } from '@/models/User';  // Use @ alias
import { adminDoc } from '@/models/Admin';  // Use @ alias
import { superAdminDoc } from '@/models/SuperAdmin';  // Use @ alias
import { collection, getDocs, query, where, updateDoc, serverTimestamp } from 'firebase/firestore';
import { generateToken } from '@/lib/jwt';  // Use @ alias

export async function POST(request) {
  try {
    const { 
      email, 
      password, 
      role = 'user',
      isEmergencyLogin = false
    } = await request.json();

    if (!email || !password && !isEmergencyLogin) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    let userData;
    let docRef;
    let userId;
    let token;

    // Handle different roles
    switch (role) {
      case 'user':
        docRef = userDoc(db, email);
        // Use getDoc instead of docRef.get()
        const userSnapshot = await getDoc(docRef);
        
        if (!userSnapshot.exists()) {  // Note: exists is a function in v9
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
        
        userData = userSnapshot.data();
        userId = userSnapshot.id;
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
          return NextResponse.json(
            { success: false, error: 'Invalid email or password' },
            { status: 401 }
          );
        }
        
        // Generate token with appropriate flags
        token = await generateToken({
          id: userId,
          email: userData.email,
          username: userData.username,
          role: 'user',
          isEmergencyLogin: isEmergencyLogin || false,
          isEmergencyUser: userData.isEmergencyUser || false
        });
        
        // Update last login time
        await updateDoc(docRef, {
          lastLogin: serverTimestamp()
        });
        
        break;
        
      case 'admin':
        docRef = adminDoc(db, email);
        // Use getDoc instead of docRef.get()
        const adminSnapshot = await getDoc(docRef);
        
        if (!adminSnapshot.exists()) {  // Note: exists is a function in v9
          return NextResponse.json(
            { success: false, error: 'Invalid email or password' },
            { status: 401 }
          );
        }
        
        userData = adminSnapshot.data();
        userId = adminSnapshot.id;
        
        // Verify password
        const isAdminPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isAdminPasswordValid) {
          return NextResponse.json(
            { success: false, error: 'Invalid email or password' },
            { status: 401 }
          );
        }
        
        // Generate token for admin
        token = await generateToken({
          id: userId,
          email: userData.email,
          name: userData.name,
          role: 'admin'
        });
        
        // Update last login time
        await updateDoc(docRef, {
          lastLogin: serverTimestamp()
        });
        
        break;
        
      case 'superAdmin':
        docRef = superAdminDoc(db, email);
        // Use getDoc instead of docRef.get()
        const superAdminSnapshot = await getDoc(docRef);
        
        if (!superAdminSnapshot.exists()) {  // Note: exists is a function in v9
          return NextResponse.json(
            { success: false, error: 'Invalid email or password' },
            { status: 401 }
          );
        }
        
        userData = superAdminSnapshot.data();
        userId = superAdminSnapshot.id;
        
        // Verify password
        const isSuperAdminPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isSuperAdminPasswordValid) {
          return NextResponse.json(
            { success: false, error: 'Invalid email or password' },
            { status: 401 }
          );
        }
        
        // Generate token for superadmin
        token = await generateToken({
          id: userId,
          email: userData.email,
          name: userData.name,
          role: 'superAdmin'
        });
        
        // Update last login time
        await updateDoc(docRef, {
          lastLogin: serverTimestamp()
        });
        
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid role specified' },
          { status: 400 }
        );
    }
    
    // Set cookie in response
    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        ...userData,
        password: undefined // Remove password from response
      },
      role,
      isEmergencyLogin: isEmergencyLogin || false,
      token
    });
    
    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 86400 // 24 hours
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
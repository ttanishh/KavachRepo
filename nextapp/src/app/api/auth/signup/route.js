import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, setDoc } from '@/lib/firebase';
import { userDoc } from '@/models/User';
import { adminDoc } from '@/models/Admin';
import { superAdminDoc } from '@/models/SuperAdmin';
import { serverTimestamp } from 'firebase/firestore';
import { sendEmail } from '@/lib/email';
import { sendVerificationCode } from '@/lib/sms';
import { generateToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    const { 
      userData,
      role = 'user',
      isEmergencyUser = false
    } = await request.json();

    // Basic validation
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User data is required' },
        { status: 400 }
      );
    }

    // Extract user data
    const { email, password, name, username, phone, fullName } = userData;

    // For non-emergency users, email and password are required
    if (!isEmergencyUser && (!email || !password)) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // For emergency users, phone is required
    if (isEmergencyUser && !phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required for emergency users' },
        { status: 400 }
      );
    }

    // For regular users, username is required
    if (role === 'user' && !isEmergencyUser && !username) {
      return NextResponse.json(
        { success: false, error: 'Username is required for standard user accounts' },
        { status: 400 }
      );
    }

    // For admin roles, additional validation
    if ((role === 'admin' || role === 'superAdmin') && (!name || !phone)) {
      return NextResponse.json(
        { success: false, error: 'Name and phone number are required for admin accounts' },
        { status: 400 }
      );
    }

    // Hash password for non-emergency users
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    
    // Handle different roles
    let docRef;
    let userId;
    let token;
    let responseData = {};
    
    switch (role) {
      case 'user':
        // For emergency users, we can generate a temporary username if not provided
        const actualUsername = username || `emergency_${Date.now()}`;
        
        // Create user document with emergency flag if applicable
        docRef = userDoc(db, isEmergencyUser ? null : email); // Use null for emergencies to get auto ID
        userId = docRef.id;
        
        // Use setDoc instead of docRef.set
        await setDoc(docRef, {
          username: actualUsername,
          email: email || null,
          password: hashedPassword,
          fullName: fullName || name || null,
          phone: phone || null,
          isActive: true,
          isEmergencyUser: isEmergencyUser,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
        
        // Generate JWT token
        token = await generateToken({
          id: userId,
          email: email || null,
          username: actualUsername,
          role: 'user',
          isEmergencyUser
        });
        
        responseData = {
          id: userId,
          email: email || null,
          username: actualUsername,
          fullName: fullName || name || null,
          phone: phone || null,
          isEmergencyUser
        };
        
        // Send welcome email for non-emergency users with email
        if (email && !isEmergencyUser) {
          try {
            await sendEmail(
              email,
              'Welcome to Kavach',
              `Hello${fullName ? ' ' + fullName : ''},\n\nThank you for creating an account with Kavach. Your safety is our priority.\n\nRegards,\nThe Kavach Team`
            );
          } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't fail the registration if email sending fails
          }
        }
        
        break;
        
      case 'admin':
        docRef = adminDoc(db, email);
        userId = docRef.id;
        
        await setDoc(docRef, {
          name,
          email,
          phoneNumber: phone,
          password: hashedPassword,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
        
        // Generate JWT token
        token = await generateToken({
          id: userId,
          email,
          role: 'admin',
          name
        });
        
        responseData = {
          id: userId,
          email,
          name,
          phoneNumber: phone
        };
        
        // Send welcome email to admin
        if (email) {
          try {
            await sendEmail(
              email,
              'Kavach Admin Account Created',
              `Hello ${name},\n\nYour Kavach admin account has been created successfully. You now have access to the admin dashboard.\n\nRegards,\nThe Kavach Team`
            );
          } catch (emailError) {
            console.error('Failed to send admin welcome email:', emailError);
          }
        }
        
        break;
        
      case 'superAdmin':
        docRef = superAdminDoc(db, email);
        userId = docRef.id;
        
        await setDoc(docRef, {
          name,
          email,
          phoneNumber: phone,
          password: hashedPassword,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
        
        // Generate JWT token
        token = await generateToken({
          id: userId,
          email,
          role: 'superAdmin',
          name
        });
        
        responseData = {
          id: userId,
          email,
          name,
          phoneNumber: phone
        };
        
        // Send welcome email to superadmin
        if (email) {
          try {
            await sendEmail(
              email,
              'Kavach Super Admin Account Created',
              `Hello ${name},\n\nYour Kavach super admin account has been created successfully. You now have full administrative access to the platform.\n\nRegards,\nThe Kavach Team`
            );
          } catch (emailError) {
            console.error('Failed to send superadmin welcome email:', emailError);
          }
        }
        
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid role specified' },
          { status: 400 }
        );
    }

    // Success response with token
    const response = NextResponse.json({
      success: true,
      message: `${role} account created successfully`,
      isEmergencyUser: isEmergencyUser || false,
      user: responseData,
      token
    }, { status: 201 });
    
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
    console.error('Signup error:', error);
    
    // Error handling
    if (error.code === 'auth/email-already-in-use' || error.message?.includes('duplicate')) {
      return NextResponse.json(
        { success: false, error: 'Email already in use' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
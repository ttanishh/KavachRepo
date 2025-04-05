import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/firebase';
import { userDoc } from '@/models/User';
import { adminDoc } from '@/models/Admin';
import { superAdminDoc } from '@/models/SuperAdmin';
import { sendEmail } from '@/lib/email';
import { sendVerificationCode } from '@/lib/sms';
import { generateToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    const { 
      email, 
      password, 
      name, 
      username, 
      phone, 
      role,
      isEmergencyUser = false
    } = await request.json();

    // Basic validation
    if (!email || !password || !role && !isEmergencyUser) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    // For emergency users, only minimal validation is needed
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Handle different roles
    let docRef;
    let userId;
    let token;
    let userData = {};
    
    switch (role) {
      case 'user':
        // For emergency users, we can generate a temporary username if not provided
        const actualUsername = username || `emergency_${Date.now()}`;
        
        // Create user document with emergency flag if applicable
        docRef = userDoc(db, email);
        await docRef.set({
          username: actualUsername,
          email,
          password: hashedPassword,
          fullName: name || null,
          phone: phone || null,
          isActive: true, // Even emergency accounts should be active immediately
          isEmergencyUser: isEmergencyUser,
          createdAt: new Date(),
          lastLogin: null
        });
        
        // Get the document ID
        userId = docRef.id;
        
        // Generate JWT token
        token = generateToken({
          id: userId,
          email,
          role: 'user',
          isEmergencyUser
        });
        
        userData = {
          id: userId,
          email,
          username: actualUsername,
          fullName: name || null,
          isEmergencyUser
        };
        
        // Send welcome email (even for emergency users)
        await sendEmail(
          email,
          isEmergencyUser ? 'Kavach Emergency Account Created' : 'Welcome to Kavach',
          `Hello${name ? ' ' + name : ''},\n\n${isEmergencyUser ? 'Your emergency account has been created. Please complete your profile when safe to do so.' : 'Thank you for creating an account with Kavach.'}\n\nYour safety is our priority.\n\nRegards,\nThe Kavach Team`
        );
        
        break;
        
      case 'admin':
        docRef = adminDoc(db, email);
        await docRef.set({
          name,
          email,
          phoneNumber: phone,
          password: hashedPassword,
          createdAt: new Date(),
          lastLogin: null
        });
        
        // Get the document ID
        userId = docRef.id;
        
        // Generate JWT token
        token = generateToken({
          id: userId,
          email,
          role: 'admin',
          name
        });
        
        userData = {
          id: userId,
          email,
          name,
          phoneNumber: phone
        };
        
        // Send welcome email to admin
        await sendEmail(
          email,
          'Kavach Admin Account Created',
          `Hello ${name},\n\nYour Kavach admin account has been created successfully. You now have access to the admin dashboard.\n\nRegards,\nThe Kavach Team`
        );
        
        break;
        
      case 'superAdmin':
        docRef = superAdminDoc(db, email);
        await docRef.set({
          name,
          email,
          phoneNumber: phone,
          password: hashedPassword,
          createdAt: new Date(),
          lastLogin: null
        });
        
        // Get the document ID
        userId = docRef.id;
        
        // Generate JWT token
        token = generateToken({
          id: userId,
          email,
          role: 'superAdmin',
          name
        });
        
        userData = {
          id: userId,
          email,
          name,
          phoneNumber: phone
        };
        
        // Send welcome email to superadmin
        await sendEmail(
          email,
          'Kavach Super Admin Account Created',
          `Hello ${name},\n\nYour Kavach super admin account has been created successfully. You now have full administrative access to the platform.\n\nRegards,\nThe Kavach Team`
        );
        
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid role specified' },
          { status: 400 }
        );
    }

    // Success response with token
    return NextResponse.json({
      success: true,
      message: `${role} account created successfully`,
      isEmergencyUser: isEmergencyUser || false,
      user: userData,
      token: token
    }, { status: 201 });
    
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
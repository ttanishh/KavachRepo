import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateOTP } from '@/lib/otp';
import { sendEmergencyOTP } from '@/lib/sms';

export async function POST(request) {
  try {
    const { phone } = await request.json();
    
    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }
    
    // Normalize phone number - ensure we have a standard format
    const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
    
    if (normalizedPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }
    
    // Generate OTP
    const otp = generateOTP();
    console.log(`Generated OTP for ${normalizedPhone}: ${otp}`);
    
    // Calculate expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    // Check if a user with this phone number exists
    const userQuery = query(collection(db, 'users'), where('phone', '==', normalizedPhone));
    const userSnapshot = await getDocs(userQuery);
    
    let userId;
    let isNewUser = false;
    
    if (!userSnapshot.empty) {
      // User exists, update their OTP
      const userDoc = userSnapshot.docs[0];
      userId = userDoc.id;
      
      await updateDoc(doc(db, 'users', userId), {
        otp,
        otpExpiresAt: expiresAt,
        updatedAt: serverTimestamp()
      });
      
      console.log(`Updated OTP for existing user ${userId}`);
    } else {
      // Create minimal emergency user with only the required fields
      isNewUser = true;
      
      // Create a new document with auto ID
      const newUserRef = doc(collection(db, 'users'));
      userId = newUserRef.id;
      
      await setDoc(newUserRef, {
        phone: normalizedPhone,
        isActive: true,
        isEmergencyUser: true,
        createdAt: serverTimestamp(),
        otp,
        otpExpiresAt: expiresAt
      });
      
      console.log(`Created minimal emergency user ${userId} with OTP`);
    }
    
    // Try to send SMS with OTP
    const smsResult = await sendEmergencyOTP(normalizedPhone, otp);
    
    console.log('SMS Result:', smsResult);
    
    // In development mode, we'll continue regardless of SMS success
    if (!smsResult.success && process.env.NODE_ENV !== 'development') {
      console.error('Failed to send SMS in production:', smsResult.error);
      return NextResponse.json(
        { success: false, error: smsResult.error || 'Failed to send verification code' },
        { status: 500 }
      );
    }
    
    // In development mode, include OTP in response for easier testing
    return NextResponse.json({
      success: true,
      message: process.env.NODE_ENV === 'development' 
        ? `OTP sent (DEV MODE: ${otp})` 
        : 'OTP sent successfully',
      expiresIn: 600, // 10 minutes in seconds
      phone: normalizedPhone,
      userId,
      isNewUser,
      // Only include OTP in development for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
    
  } catch (error) {
    console.error('Emergency OTP error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
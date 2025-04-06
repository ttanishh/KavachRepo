'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { auth } from '@/lib/firebase';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import FormError from '@/components/common/FormError';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError('Please fill in all fields');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Phone validation (10 digits, Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit Indian phone number');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('Please create a password and confirm it');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    setError('');
    
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSendOtp();
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Send OTP via API
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          email: formData.email,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      
      setOtpSent(true);
      setStep(3);
      toast.success('OTP sent to your phone and email!');
    } catch (err) {
      console.error('OTP error:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Verify OTP via API
      const verifyResponse = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          otp: otp,
        }),
      });
      
      const verifyData = await verifyResponse.json();
      
      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || 'Invalid OTP');
      }
      
      // OTP verified, now proceed with account creation
      await handleCreateAccount();
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Failed to verify OTP. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    try {
      // Create Firebase auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: formData.fullName,
      });
      
      // Register with our backend
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }
      
      toast.success('Account created successfully!');
      router.push('/u/reports');
    } catch (err) {
      console.error('Signup error:', err);
      
      // Handle Firebase auth errors
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
      
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 3) {
      handleVerifyOtp();
    } else {
      handleNext();
    }
  };

  const renderStep1 = () => (
    <>
      <div className="space-y-4">
        <Input
          id="fullName"
          name="fullName"
          type="text"
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />
        
        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          autoComplete="email"
        />
        
        <Input
          id="phone"
          name="phone"
          type="tel"
          label="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your 10-digit phone number"
          required
          autoComplete="tel"
        />
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="space-y-4">
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a strong password"
          required
          autoComplete="new-password"
          helpText="Must be at least 8 characters long"
        />
        
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
          autoComplete="new-password"
        />
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We sent a verification code to your phone number ({formData.phone})
          </p>
        </div>
        
        <Input
          id="otp"
          name="otp"
          type="text"
          label="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          required
          autoComplete="one-time-code"
          inputMode="numeric"
          maxLength={6}
        />
        
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={isLoading}
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-full h-2 rounded-full mx-1 ${
                s < step ? 'bg-primary-600' : s === step ? 'bg-primary-400' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
        
        <FormError error={error} />
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
              >
                Back
              </Button>
            )}
            
            <Button
              type={step === 3 ? 'submit' : 'button'}
              variant="primary"
              onClick={step !== 3 ? handleNext : undefined}
              isLoading={isLoading}
              disabled={isLoading}
              className={`${step === 1 ? 'w-full' : ''}`}
            >
              {step === 3 ? 'Create Account' : 'Continue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

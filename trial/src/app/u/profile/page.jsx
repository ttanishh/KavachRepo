'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiShield, FiCamera, FiEdit, FiSave, FiX } from 'react-icons/fi';
import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import FormError from '@/components/common/FormError';

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [passwordError, setPasswordError] = useState('');

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user profile');
        }
        
        setUser(data);
        setProfileData({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.message || 'Failed to load user profile');
        toast.error('Error loading profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleEditMode = () => {
    if (editMode) {
      // Reset form if canceling edit
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
    setEditMode(!editMode);
    setPasswordError('');
  };

  const validateForm = () => {
    // Basic validation
    if (!profileData.fullName) {
      setError('Full name is required');
      return false;
    }
    
    if (!profileData.email) {
      setError('Email is required');
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Phone validation (assuming Indian format)
    if (profileData.phone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(profileData.phone.replace(/\D/g, ''))) {
        setError('Please enter a valid 10-digit Indian phone number');
        return false;
      }
    }
    
    // Password validation (only if attempting to change password)
    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        setPasswordError('Current password is required to set a new password');
        return false;
      }
      
      if (profileData.newPassword.length < 8) {
        setPasswordError('New password must be at least 8 characters long');
        return false;
      }
      
      if (profileData.newPassword !== profileData.confirmPassword) {
        setPasswordError('New passwords do not match');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordError('');
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      // Update profile information
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: profileData.fullName,
          phone: profileData.phone,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      // Handle email/password update if changed
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (currentUser && profileData.email !== user.email) {
        await updateEmail(currentUser, profileData.email);
      }
      
      if (currentUser && profileData.newPassword && profileData.currentPassword) {
        try {
          // Re-authenticate user before changing password
          const credential = EmailAuthProvider.credential(
            currentUser.email,
            profileData.currentPassword
          );
          
          await reauthenticateWithCredential(currentUser, credential);
          await updatePassword(currentUser, profileData.newPassword);
        } catch (authErr) {
          console.error('Auth error:', authErr);
          if (authErr.code === 'auth/wrong-password') {
            setPasswordError('Current password is incorrect');
          } else {
            setPasswordError(authErr.message || 'Failed to update password');
          }
          // Continue with the rest of the updates even if password update fails
        }
      }
      
      // Update local user state
      setUser(prev => ({
        ...prev,
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
      }));
      
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      toast.error('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          
          {!editMode ? (
            <Button
              type="button"
              variant="outline"
              onClick={toggleEditMode}
            >
              <FiEdit className="mr-2" />
              Edit Profile
            </Button>
          ) : (
            <button
              type="button"
              onClick={toggleEditMode}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="p-6">
          <FormError error={error} />
          
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.fullName}
                        className="h-32 w-32 rounded-full object-cover"
                      />
                    ) : (
                      <FiUser className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  
                  {editMode && (
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-md hover:bg-primary-700 transition-colors"
                    >
                      <FiCamera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user?.fullName}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    User
                  </p>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <Input
                    id="fullName"
                    name="fullName"
                    label="Full Name"
                    icon={<FiUser />}
                    value={profileData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    disabled={!editMode}
                    required
                  />
                  
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    icon={<FiMail />}
                    value={profileData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    disabled={!editMode}
                    required
                  />
                  
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    icon={<FiPhone />}
                    value={profileData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    disabled={!editMode}
                  />
                </div>
                
                {editMode && (
                  <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Change Password
                    </h3>
                    
                    <FormError error={passwordError} />
                    
                    <div className="space-y-4">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        label="Current Password"
                        icon={<FiShield />}
                        value={profileData.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter your current password"
                      />
                      
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        label="New Password"
                        value={profileData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        helpText="Must be at least 8 characters long"
                      />
                      
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        label="Confirm New Password"
                        value={profileData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                )}
                
                {editMode && (
                  <div className="flex justify-end space-x-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={toggleEditMode}
                    >
                      Cancel
                    </Button>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={saving}
                      disabled={saving}
                    >
                      <FiSave className="mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

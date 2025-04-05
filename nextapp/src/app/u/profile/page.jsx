'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Avatar } from '@/components/common/Avatar';
import { ProfileForm } from '@/components/u/ProfileForm';

// Mock user data
const userData = {
  id: 'USR123456',
  name: 'Rahul Kumar',
  email: 'rahul.kumar@example.com',
  phone: '+91 9876543210',
  address: '123 Park Street, Ahmedabad, Gujarat',
  aadhaarVerified: true,
  createdAt: '2024-12-15T10:30:00Z',
  avatar: '/images/avatars/user-1.jpg'
};

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    address: userData.address,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/u/dashboard' },
    { label: 'My Profile' },
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would submit the updated profile to your API
    console.log('Updated profile:', formData);
    setIsEditing(false);
  };
  
  return (
    <div className="py-6">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">My Profile</h1>
        <Button 
          variant={isEditing ? "outline" : "default"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Cancel Edit
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm 
                  userData={formData}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="border-b border-[var(--surface-200)] pb-5">
                <div className="flex items-center">
                  <Avatar src={userData.avatar} name={userData.name} size="lg" />
                  <div className="ml-4">
                    <CardTitle>{userData.name}</CardTitle>
                    <p className="text-sm text-[var(--surface-500)]">
                      User ID: {userData.id}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-[var(--surface-500)]">Full Name</h4>
                        <p className="text-[var(--foreground)]">{userData.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[var(--surface-500)]">Email Address</h4>
                        <p className="text-[var(--foreground)]">{userData.email}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[var(--surface-500)]">Phone Number</h4>
                        <p className="text-[var(--foreground)]">{userData.phone}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[var(--surface-500)]">Aadhaar Verification</h4>
                        <div className="flex items-center mt-1">
                          {userData.aadhaarVerified ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--success-500)] mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-[var(--success-500)]">Verified</span>
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--warning-500)] mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <span className="text-[var(--warning-500)]">Not Verified</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-[var(--surface-200)] pt-5">
                    <h3 className="text-lg font-semibold mb-3">Address</h3>
                    <p className="text-[var(--surface-700)]">{userData.address}</p>
                  </div>
                  
                  <div className="border-t border-[var(--surface-200)] pt-5">
                    <h3 className="text-lg font-semibold mb-3">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-[var(--surface-500)]">Account Created</h4>
                        <p className="text-[var(--foreground)]">{new Date(userData.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[var(--surface-500)]">Password</h4>
                        <p className="text-[var(--foreground)]">••••••••</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[var(--primary-50)] p-4 rounded-md border border-[var(--primary-100)]">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--primary-600)] mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-medium text-[var(--foreground)]">Account Protection</h3>
                </div>
                <p className="text-sm text-[var(--surface-600)]">
                  Enhance your account security by enabling two-factor authentication.
                </p>
                <Button variant="secondary" className="mt-3 w-full">
                  Enable 2FA
                </Button>
              </div>
              
              {!isEditing && (
                <div>
                  <h3 className="text-sm font-medium text-[var(--surface-700)] mb-3">Change Password</h3>
                  <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Change Password
                  </Button>
                </div>
              )}
              
              <div className="border-t border-[var(--surface-200)] pt-4">
                <h3 className="text-sm font-medium text-[var(--surface-700)] mb-3">Connected Devices</h3>
                <div className="space-y-3">
                  <div className="bg-[var(--surface-50)] p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--surface-400)] mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1H5zm12 14a2 2 0 01-2 2H5a2 2 0 01-2-2V3a2 2 0 012-2h10a2 2 0 012 2v13zm-9-1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="font-medium text-[var(--surface-700)]">iPhone 15</div>
                          <div className="text-xs text-[var(--surface-500)]">Current Device</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[var(--surface-50)] p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--surface-400)] mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H9.771l-.467-1.404A1 1 0 008.401 10h3.198a1 1 0 00.903.596h.904v-2.5a1 1 0 00-1-1h-3a1 1 0 00-1 1V8.5a1 1 0 001 1h.904A1 1 0 0011.5 10.596 1 1 0 0112 11z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="font-medium text-[var(--surface-700)]">MacBook Pro</div>
                          <div className="text-xs text-[var(--surface-500)]">Last active: 2 hours ago</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Log Out All Devices
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-[var(--surface-700)]">Profile Visibility</h3>
                    <p className="text-xs text-[var(--surface-500)]">Control who can see your profile information</p>
                  </div>
                  <div className="h-6 w-11 relative">
                    <input 
                      type="checkbox" 
                      id="profile-visibility" 
                      className="peer sr-only" 
                      defaultChecked 
                    />
                    <label 
                      htmlFor="profile-visibility" 
                      className="bg-[var(--surface-300)] peer-checked:bg-[var(--primary-600)] block h-6 w-11 rounded-full cursor-pointer transition-colors"
                    ></label>
                    <span 
                      className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"
                    ></span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-[var(--surface-700)]">Email Notifications</h3>
                    <p className="text-xs text-[var(--surface-500)]">Receive email updates about your case</p>
                  </div>
                  <div className="h-6 w-11 relative">
                    <input 
                      type="checkbox" 
                      id="email-notifications" 
                      className="peer sr-only" 
                      defaultChecked 
                    />
                    <label 
                      htmlFor="email-notifications" 
                      className="bg-[var(--surface-300)] peer-checked:bg-[var(--primary-600)] block h-6 w-11 rounded-full cursor-pointer transition-colors"
                    ></label>
                    <span 
                      className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"
                    ></span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-[var(--surface-700)]">SMS Alerts</h3>
                    <p className="text-xs text-[var(--surface-500)]">Receive text messages for urgent updates</p>
                  </div>
                  <div className="h-6 w-11 relative">
                    <input 
                      type="checkbox" 
                      id="sms-alerts" 
                      className="peer sr-only" 
                    />
                    <label 
                      htmlFor="sms-alerts" 
                      className="bg-[var(--surface-300)] peer-checked:bg-[var(--primary-600)] block h-6 w-11 rounded-full cursor-pointer transition-colors"
                    ></label>
                    <span 
                      className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"
                    ></span>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 border-t border-[var(--surface-200)] pt-5">
                <Button variant="outline" className="w-full text-[var(--error-500)] border-[var(--surface-200)] hover:bg-[var(--accent-50)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
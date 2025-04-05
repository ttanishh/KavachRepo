'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('citizen');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false,
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Get display name for the currently selected role
  const getRoleDisplayName = () => {
    switch(activeTab) {
      case 'citizen': return 'Citizen';
      case 'admin': return 'Police Officer';
      case 'superAdmin': return 'System Administrator';
      default: return 'User';
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Common validations
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.termsAgreed) {
      newErrors.termsAgreed = 'You must agree to the Terms of Service and Privacy Policy';
    }
    
    // Role-specific validations
    if (activeTab === 'citizen' && !formData.username) {
      newErrors.username = 'Username is required for citizen accounts';
    }
    
    if ((activeTab === 'admin' || activeTab === 'superAdmin') && !formData.name) {
      newErrors.name = 'Full name is required for official accounts';
    }
    
    if ((activeTab === 'admin' || activeTab === 'superAdmin') && !formData.phone) {
      newErrors.phone = 'Phone number is required for official accounts';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Map tabs to roles
      const roleMapping = {
        citizen: 'user',
        admin: 'admin',
        superAdmin: 'superAdmin'
      };
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData: {
            username: formData.username,
            email: formData.email,
            fullName: formData.fullName,
            name: formData.name || formData.fullName, 
            phone: formData.phone,
            password: formData.password
          },
          role: roleMapping[activeTab]
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect to login page with success message
        router.push('/auth/login?registered=true&role=' + activeTab);
      } else {
        setErrors({
          form: data.error || 'Failed to create account. Please try again.'
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({
        form: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Signup form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image 
                src="/images/kavach-logo.svg" 
                alt="Kavach Logo" 
                width={180} 
                height={48}
                className="mx-auto"
              />
            </Link>
            <h1 className="text-2xl font-bold mt-6 mb-2">Create a {getRoleDisplayName()} Account</h1>
            <p className="text-gray-500">Join Kavach to report and track incidents</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              {/* Role Tabs */}
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveTab('citizen')}
                    className={`py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'citizen'
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('admin')}
                    className={`py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'admin'
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Police
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('superAdmin')}
                    className={`py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'superAdmin'
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>
              
              {/* Account type description */}
              <div className="mb-4 px-3 py-2 bg-gray-50 rounded text-gray-600 text-sm">
                {activeTab === 'citizen' && (
                  <p>Create a regular citizen account to report incidents and access community safety resources.</p>
                )}
                {activeTab === 'admin' && (
                  <p>Police officer accounts have administrative access to manage incident reports and communicate with citizens.</p>
                )}
                {activeTab === 'superAdmin' && (
                  <p>System administrator accounts have complete access to all features, including user management and system configuration.</p>
                )}
              </div>
              
              {errors.form && (
                <div className="mb-4 p-3 rounded bg-red-50 text-red-500 text-sm">
                  {errors.form}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Email field - shown for all roles */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`block w-full px-3 py-2 border ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  
                  {/* Username field - shown only for citizens */}
                  {activeTab === 'citizen' && (
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className={`block w-full px-3 py-2 border ${
                          errors.username ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      />
                      {errors.username && (
                        <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Name field - required for police and admin */}
                  {(activeTab === 'admin' || activeTab === 'superAdmin') && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`block w-full px-3 py-2 border ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Full Name field - optional for citizens */}
                  {activeTab === 'citizen' && (
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-gray-400 text-xs">(Optional)</span>
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2 border ${
                          errors.fullName ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Phone field - required for police/admin, optional for citizens */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                      {activeTab === 'citizen' && <span className="text-gray-400 text-xs"> (Optional)</span>}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      required={activeTab !== 'citizen'}
                      className={`block w-full px-3 py-2 border ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                  
                  {/* Password fields - shown for all roles */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`block w-full px-3 py-2 border ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`block w-full px-3 py-2 border ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                  
                  {/* Terms and Conditions agreement */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="termsAgreed"
                        name="termsAgreed"
                        type="checkbox"
                        checked={formData.termsAgreed}
                        onChange={handleChange}
                        required
                        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                          errors.termsAgreed ? 'border-red-300' : ''
                        }`}
                      />
                    </div>
                    <div className="ml-2">
                      <label htmlFor="termsAgreed" className="text-sm text-gray-700">
                        I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                      </label>
                      {errors.termsAgreed && (
                        <p className="mt-1 text-sm text-red-600">{errors.termsAgreed}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Submit button */}
                  <button
                    type="submit"
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      activeTab === 'citizen' 
                        ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' 
                        : activeTab === 'admin'
                          ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                          : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : `Create ${getRoleDisplayName()} Account`}
                  </button>
                </div>
              </form>
              
              {/* Already have an account link */}
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
              
              {/* Emergency report link - only show for citizen tab */}
              {activeTab === 'citizen' && (
                <div className="mt-6 text-center">
                  <Link href="/emergency-report" className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    File an Emergency Report
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Image and description */}
      <div className="hidden lg:flex flex-1 relative bg-indigo-500">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-indigo-500 opacity-90"></div>
        <div className="relative z-10 p-12 flex flex-col justify-center text-white max-w-lg mx-auto">
          <h2 className="text-3xl font-bold mb-6">Join the Kavach community</h2>
          <p className="mb-6">
            By creating an account, you'll gain access to a range of features designed to enhance public safety and streamline incident reporting.
          </p>
          
          <div className="space-y-4 mt-6">
            {activeTab === 'citizen' && (
              <>
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium">Submit Reports</h3>
                    <p className="text-white text-opacity-80 text-sm">
                      File detailed reports for various incidents with supporting evidence
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium">Track Progress</h3>
                    <p className="text-white text-opacity-80 text-sm">
                      Monitor the status and progress of your submitted reports
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium">Stay Informed</h3>
                    <p className="text-white text-opacity-80 text-sm">
                      Receive alerts and safety notifications relevant to your area
                    </p>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'admin' && (
              <>
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium">Case Management</h3>
                    <p className="text-white text-opacity-80 text-sm">
                      Manage assigned cases efficiently with our integrated tools
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium">Citizen Communication</h3>
                    <p className="text-white text-opacity-80 text-sm">
                      Directly communicate with citizens about their reports
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium">Resource Management</h3>
                    <p className="text-white text-opacity-80 text-sm">
                      Optimize deployment of resources and personnel
                    </p>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'superAdmin' && (
              <>
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium">Complete Oversight</h3>
                    <p className="text-white text-opacity-80 text-sm">
                      Full system administration with comprehensive analytics
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium">User Management</h3>
                    <p className="text-white text-opacity-80 text-sm">
                      Manage officers and administrative accounts
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium">System Configuration</h3>
                    <p className="text-white text-opacity-80 text-sm">
                      Customize and configure the platform to meet your needs
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
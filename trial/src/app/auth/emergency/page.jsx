'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FiAlertCircle, FiArrowLeft, FiMapPin } from 'react-icons/fi';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import FormError from '@/components/common/FormError';
import MapPicker from '@/components/common/MapPicker';

export default function EmergencyPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: '',
    location: null,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 21.1702, lng: 72.8311 }); // Default to Surat

  // Try to get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setFormData(prev => ({ ...prev, location }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLocationChange = (location) => {
    setFormData((prev) => ({
      ...prev,
      location,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!formData.name || !formData.phone || !formData.description) {
      setError('Please fill in all fields');
      return;
    }

    if (!formData.location) {
      setError('Please select your location on the map');
      return;
    }

    // Validate phone
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit Indian phone number');
      return;
    }

    setIsLoading(true);

    try {
      // Send emergency report to server
      const response = await fetch('/api/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit emergency report');
      }

      toast.success('Emergency report submitted!');
      setIsSubmitted(true);
    } catch (err) {
      console.error('Emergency submission error:', err);
      setError(err.message || 'Failed to submit emergency report. Please try again or call 100.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Emergency Report Submitted
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your emergency report has been received. Help is on the way. Stay safe and remain at your location if possible.
            </p>
            
            <div className="mt-8 flex flex-col space-y-4">
              <Button href="/" variant="primary" className="w-full">
                Return to Home
              </Button>
              
              <Link href="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
                Sign in to track your report
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors">
              <FiArrowLeft className="mr-2" />
              Back to Home
            </Link>
            
            <div className="flex items-center text-danger-600">
              <FiAlertCircle className="mr-2" />
              <span className="font-medium">Emergency</span>
            </div>
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Report an Emergency
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Submit this form to get immediate help from the nearest police station
          </p>
        </div>
        
        <FormError error={error} />
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              id="name"
              name="name"
              type="text"
              label="Your Name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
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
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Emergency Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="Briefly describe the emergency situation"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Your Location
              </label>
              <MapPicker
                initialLocation={userLocation}
                onLocationChange={handleLocationChange}
                height="250px"
              />
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <FiMapPin className="mr-1" />
                <span>
                  {formData.location
                    ? `Selected: ${formData.location.lat.toFixed(6)}, ${formData.location.lng.toFixed(6)}`
                    : 'Please select your location on the map'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="danger"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Send Emergency Report
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              For immediate police assistance, call <strong>100</strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

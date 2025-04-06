'use client';

import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import FormError from './FormError';
import MapPicker from './MapPicker';

const StationForm = ({ 
  initialData = {}, 
  onSubmit, 
  isLoading = false,
  submitLabel = 'Save Station',
  districts = []
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    district: initialData.district || '',
    address: initialData.address || '',
    phone: initialData.phone || '',
    email: initialData.email || '',
    location: initialData.location || { lat: 21.1702, lng: 72.8311 }, // Default to Surat
    ...initialData
  });
  
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLocationChange = (location) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!formData.name || !formData.district || !formData.address || !formData.phone || !formData.email) {
      setFormError('Please fill all required fields.');
      return;
    }

    if (!formData.location || !formData.location.lat || !formData.location.lng) {
      setFormError('Please select a location on the map.');
      return;
    }

    // Very basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    // Phone validation (assuming Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setFormError('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormError error={formError} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="name"
          name="name"
          label="Station Name *"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter police station name"
          required
        />
        
        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            District *
          </label>
          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            required
          >
            <option value="">Select District</option>
            {districts.length > 0 ? (
              districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))
            ) : (
              <>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Surat">Surat</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Rajkot">Rajkot</option>
                <option value="Bhavnagar">Bhavnagar</option>
                <option value="Jamnagar">Jamnagar</option>
                <option value="Gandhinagar">Gandhinagar</option>
                <option value="Junagadh">Junagadh</option>
                <option value="Anand">Anand</option>
                <option value="Mehsana">Mehsana</option>
              </>
            )}
          </select>
        </div>
        
        <Input
          id="email"
          name="email"
          type="email"
          label="Email *"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter station email"
          required
        />
        
        <Input
          id="phone"
          name="phone"
          label="Phone Number *"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter 10-digit phone number"
          required
        />
        
        <div className="md:col-span-2">
          <Input
            id="address"
            name="address"
            label="Full Address *"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter complete address"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Station Location *
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Drag the marker or click on the map to select the precise station location
        </p>
        <MapPicker
          initialLocation={formData.location}
          onLocationChange={handleLocationChange}
          height="400px"
          showSearch={true}
        />
        
        <div className="mt-2 grid grid-cols-2 gap-4">
          <Input
            id="latitude"
            label="Latitude"
            value={formData.location?.lat?.toFixed(6) || ''}
            readOnly
            disabled
          />
          <Input
            id="longitude"
            label="Longitude"
            value={formData.location?.lng?.toFixed(6) || ''}
            readOnly
            disabled
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default StationForm;

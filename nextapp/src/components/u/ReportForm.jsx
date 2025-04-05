// components/u/ReportForm.jsx
import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Map } from '../common/Map';
import { MediaUploader } from '../common/MediaUploader';
import { Alert } from '../common/Alert';
import { Card, CardContent } from '../common/Card';

export function ReportForm({
  onSubmit,
  isLoading = false,
  className = '',
  ...props
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    crimeType: '',
    location: { lat: 23.0225, lng: 72.5714 }, // Default to Ahmedabad, Gujarat
    address: '',
    media: [],
  });
  
  const [errors, setErrors] = useState({});
  
  const crimeTypes = [
    'Theft',
    'Robbery',
    'Assault',
    'Vandalism',
    'Cybercrime',
    'Traffic Violation',
    'Public Nuisance',
    'Other'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleLocationChange = (location) => {
    setFormData(prev => ({ ...prev, location }));
    // You would typically do a reverse geocode here to get the address
  };
  
  const handleMediaChange = (media) => {
    setFormData(prev => ({ ...prev, media }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.crimeType) {
      newErrors.crimeType = 'Please select a crime type';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className={`space-y-6 ${className}`}
      {...props}
    >
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold text-surface-900 mb-6">Report a Crime</h2>
          
          <div className="space-y-4">
            <Input
              label="Title"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Briefly describe what happened"
            />
            
            <div>
              <label 
                htmlFor="crimeType" 
                className="block text-sm font-medium text-surface-700 mb-1"
              >
                Crime Type
              </label>
              <select
                id="crimeType"
                name="crimeType"
                value={formData.crimeType}
                onChange={handleChange}
                className={`
                  w-full px-3 py-2 bg-surface-50 border rounded-md focus:outline-none focus:ring-2
                  ${errors.crimeType 
                    ? 'border-error-500 focus:ring-error-100' 
                    : 'border-surface-300 focus:ring-primary-100 focus:border-primary-500'}
                `}
              >
                <option value="">Select crime type</option>
                {crimeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.crimeType && (
                <p className="text-xs text-error-500 mt-1">{errors.crimeType}</p>
              )}
            </div>
            
            <div>
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-surface-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`
                  w-full px-3 py-2 bg-surface-50 border rounded-md focus:outline-none focus:ring-2
                  ${errors.description 
                    ? 'border-error-500 focus:ring-error-100' 
                    : 'border-surface-300 focus:ring-primary-100 focus:border-primary-500'}
                `}
                placeholder="Please provide detailed information about the incident"
              />
              {errors.description && (
                <p className="text-xs text-error-500 mt-1">{errors.description}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Location
              </label>
              <Alert variant="info" className="mb-2">
                Click on the map to set the incident location or use your current location
              </Alert>
              <Map
                center={[formData.location.lat, formData.location.lng]}
                markers={[{ position: [formData.location.lat, formData.location.lng] }]}
                onClick={handleLocationChange}
                height="300px"
                className="mb-2"
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // In a real app, this would use the browser's geolocation API
                    alert('This would use your current location in a real app');
                  }}
                >
                  Use Current Location
                </Button>
              </div>
            </div>
            
            <Input
              label="Address"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              placeholder="Enter the full address of the incident"
            />
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Media Evidence (Optional)
              </label>
              <MediaUploader
                multiple
                accept="image/*,video/*"
                onChange={handleMediaChange}
                value={formData.media}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Submit Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
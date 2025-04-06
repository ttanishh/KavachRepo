// components/sa/StationForm.jsx
import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Map } from '../common/Map';

export function StationForm({
  station,
  onSubmit,
  isLoading = false,
  className = '',
  ...props
}) {
  const [formData, setFormData] = useState({
    name: station?.name || '',
    code: station?.code || '',
    district: station?.district || '',
    address: station?.address || '',
    phone: station?.phone || '',
    email: station?.email || '',
    location: station?.location || { lat: 23.0225, lng: 72.5714 }, // Default to Ahmedabad, Gujarat
    status: station?.status || 'active',
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleLocationChange = (e) => {
    // In a real implementation, this would extract lat/lng from the map click event
    // For now, let's just add some randomness to the current location
    const lat = formData.location.lat + (Math.random() * 0.01 - 0.005);
    const lng = formData.location.lng + (Math.random() * 0.01 - 0.005);
    setFormData(prev => ({ ...prev, location: { lat, lng } }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Station name is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Station code is required';
    }
    
    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
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
        <CardHeader>
          <CardTitle>{station ? 'Edit Station' : 'Add New Station'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Station Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Police Station Name"
            />
            
            <Input
              label="Station Code"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              error={errors.code}
              placeholder="e.g. PS-AHM-001"
            />
            
            <Input
              label="District"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              error={errors.district}
              placeholder="District Name"
            />
            
            <div>
              <label 
                htmlFor="status" 
                className="block text-sm font-medium text-surface-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border-surface-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <Input
              label="Phone Number"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="Station Contact Number"
            />
            
            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Station Email Address"
            />
            
            <div className="md:col-span-2">
              <Input
                label="Address"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="Full Station Address"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Station Location
              </label>
              <p className="text-sm text-surface-500 mb-2">
                Click on the map to set the station location
              </p>
              <Map
                center={[formData.location.lat, formData.location.lng]}
                markers={[{ position: [formData.location.lat, formData.location.lng] }]}
                onClick={handleLocationChange}
                height="300px"
              />
              <div className="mt-1 text-sm text-surface-500">
                Coordinates: {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {station ? 'Save Changes' : 'Create Station'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
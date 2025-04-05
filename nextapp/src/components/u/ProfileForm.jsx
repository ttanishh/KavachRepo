// components/u/ProfileForm.jsx
import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Avatar } from '../common/Avatar';

export function ProfileForm({
  user,
  onSubmit,
  isLoading = false,
  className = '',
  ...props
}) {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    emergencyContact: user?.emergencyContact || '',
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
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
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
      className={`${className}`}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <Avatar
              src={user?.avatar}
              name={user?.fullName}
              size="xl"
              className="mr-4"
            />
            <div>
              <h3 className="text-lg font-medium text-surface-900">Profile Photo</h3>
              <p className="text-sm text-surface-500 mb-2">
                This will be displayed on your profile
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
              >
                Change Photo
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Full Name"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
            
            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            
            <Input
              label="Phone Number"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            
            <Input
              label="Address"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />
            
            <Input
              label="Emergency Contact"
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              error={errors.emergencyContact}
              helperText="Phone number of a person to contact in case of emergency"
            />
          </div>
          
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LocationPicker } from '@/components/u/LocationPicker';
import { Breadcrumb } from '@/components/common/Breadcrumb';

const crimeTypes = [
  { value: 'theft', label: 'Theft' },
  { value: 'robbery', label: 'Robbery' },
  { value: 'assault', label: 'Assault' },
  { value: 'vandalism', label: 'Vandalism' },
  { value: 'cybercrime', label: 'Cybercrime' },
  { value: 'traffic_violation', label: 'Traffic Violation' },
  { value: 'public_nuisance', label: 'Public Nuisance' },
  { value: 'other', label: 'Other' }
];

export default function NewReport() {
  const [formData, setFormData] = useState({
    title: '',
    crimeType: '',
    description: '',
    date: '',
    time: '',
    location: { lat: 23.0225, lng: 72.5714 },
    address: '',
    witnesses: false,
    anonymous: false,
    files: []
  });
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/u/dashboard' },
    { label: 'My Reports', href: '/u/reports' },
    { label: 'Report New Case' },
  ];
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleLocationChange = (locationData) => {
    setFormData(prev => ({
      ...prev,
      location: locationData.location,
      address: locationData.address
    }));
  };
  
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...Array.from(e.target.files)]
      }));
    }
  };
  
  const removeFile = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }));
  };
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Here you would typically send the data to your API
    console.log('Submitting form data:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to success page or show success message
      window.location.href = '/u/reports/success?id=RPT' + Math.floor(1000000 + Math.random() * 9000000);
    }, 2000);
  };
  
  return (
    <div className="py-6">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />
      
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Report New Case</h1>
      
      <div className="mb-8">
        <div className="relative">
          <div className="flex items-center justify-between w-full mb-2">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold`}
                  style={{
                    backgroundColor: step === stepNumber 
                      ? 'var(--primary-500)' 
                      : step > stepNumber 
                        ? 'var(--success-500)' 
                        : 'var(--surface-200)',
                    color: step === stepNumber || step > stepNumber 
                      ? 'white' 
                      : 'var(--surface-700)'
                  }}
                >
                  {step > stepNumber ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className="text-sm mt-2" style={{ color: 'var(--surface-600)' }}>
                  {stepNumber === 1 ? 'Basic Details' : stepNumber === 2 ? 'Location' : 'Evidence'}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full h-1 absolute top-5 -z-10" style={{ backgroundColor: 'var(--surface-200)' }}></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Case Title"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief title describing the incident"
                required
              />
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--surface-700)' }} htmlFor="crimeType">
                  Type of Crime
                </label>
                <select
                  id="crimeType"
                  name="crimeType"
                  value={formData.crimeType}
                  onChange={handleChange}
                  className="block w-full rounded-md shadow-sm"
                  style={{ 
                    borderColor: 'var(--surface-300)', 
                    borderWidth: '1px',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                  required
                >
                  <option value="">Select Type</option>
                  {crimeTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--surface-700)' }} htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="block w-full rounded-md shadow-sm"
                  style={{ 
                    borderColor: 'var(--surface-300)', 
                    borderWidth: '1px',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                  placeholder="Provide a detailed description of what happened"
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Date of Incident"
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                
                <Input
                  label="Time of Incident"
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <input
                    id="witnesses"
                    name="witnesses"
                    type="checkbox"
                    checked={formData.witnesses}
                    onChange={handleChange}
                    className="h-4 w-4 rounded"
                    style={{ 
                      borderColor: 'var(--surface-300)',
                      color: 'var(--primary-500)'
                    }}
                  />
                  <label htmlFor="witnesses" className="ml-2 block text-sm" style={{ color: 'var(--surface-700)' }}>
                    There were witnesses to this incident
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="anonymous"
                    name="anonymous"
                    type="checkbox"
                    checked={formData.anonymous}
                    onChange={handleChange}
                    className="h-4 w-4 rounded"
                    style={{ 
                      borderColor: 'var(--surface-300)',
                      color: 'var(--primary-500)'
                    }}
                  />
                  <label htmlFor="anonymous" className="ml-2 block text-sm" style={{ color: 'var(--surface-700)' }}>
                    Submit this report anonymously
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="button" onClick={nextStep}>
                  Next: Location
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Incident Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm" style={{ color: 'var(--surface-500)' }}>
                Please mark the location where the incident occurred on the map below, or use the "Use Current Location" button to set your current location.
              </p>
              
              <LocationPicker
                initialLocation={formData.location}
                onChange={handleLocationChange}
              />
              
              <Input
                label="Address"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address of the incident location"
                required
              />
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button type="button" onClick={nextStep}>
                  Next: Evidence
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Evidence Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm" style={{ color: 'var(--surface-500)' }}>
                Upload any photos, videos, or documents that provide evidence of the incident. This step is optional but recommended.
              </p>
              
              <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{ borderColor: 'var(--surface-300)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" style={{ color: 'var(--surface-400)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-2 text-sm" style={{ color: 'var(--surface-600)' }}>
                  Drag and drop files here, or click to select files
                </p>
                <input
                  type="file"
                  id="files"
                  name="files"
                  onChange={handleFileChange}
                  multiple
                  className="opacity-0 absolute inset-0 w-full cursor-pointer"
                />
              </div>
              
              {formData.files.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--surface-700)' }}>Uploaded Files:</h3>
                  <ul className="space-y-2">
                    {formData.files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--surface-100)' }}>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" style={{ color: 'var(--surface-500)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm truncate max-w-xs" style={{ color: 'var(--surface-700)' }}>{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: 'var(--error-500)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
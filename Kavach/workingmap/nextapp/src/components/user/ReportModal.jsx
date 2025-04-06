import React, { useState } from 'react';
import { format } from 'date-fns';

const ReportModal = ({ location, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'theft',
    description: '',
    media: null,
    timestamp: new Date(),
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formStep, setFormStep] = useState(1); // Multi-step form
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const crimeTypes = [
    { id: 'theft', label: 'Theft', icon: '🕵️' },
    { id: 'assault', label: 'Assault', icon: '👊' },
    { id: 'vandalism', label: 'Vandalism', icon: '🔨' },
    { id: 'fraud', label: 'Fraud', icon: '💳' },
    { id: 'burglary', label: 'Burglary', icon: '🏠' },
    { id: 'other', label: 'Other', icon: '❓' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
    if (!allowedTypes.includes(file.type)) {
      setValidationErrors(prev => ({...prev, media: 'Only image (JPEG, PNG, GIF) and video (MP4) files are allowed.'}));
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setValidationErrors(prev => ({...prev, media: 'File size should not exceed 5MB.'}));
      return;
    }

    setFormData(prev => ({ ...prev, media: file }));
    setValidationErrors(prev => {
      const newErrors = {...prev};
      delete newErrors.media;
      return newErrors;
    });

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For videos, we'll just show a placeholder
      setPreviewUrl('video');
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!formData.type) {
        errors.type = 'Please select a crime type';
      }
    }
    
    if (step === 2) {
      if (!formData.description.trim()) {
        errors.description = 'Please provide a description';
      } else if (formData.description.trim().length < 10) {
        errors.description = 'Description should be at least 10 characters';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(formStep + 1);
    }
  };

  const prevStep = () => {
    setFormStep(formStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    if (!validateStep(formStep)) {
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // For file upload, we need to use FormData
      let mediaUrl = null;

      if (formData.media) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.media);
        
        const uploadResponse = await fetch('/api/media/upload', {
          method: 'POST',
          body: uploadFormData
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload media');
        }
        
        const uploadResult = await uploadResponse.json();
        
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload media');
        }
        
        mediaUrl = uploadResult.url;
        setUploadProgress(100);
      }

      // Submit the complete report
      await onSubmit({
        ...formData,
        media: mediaUrl,
      });
      
    } catch (error) {
      console.error('Error submitting report:', error);
      setValidationErrors({submit: error.message || 'Failed to submit report. Please try again.'});
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render specific step content
  const renderStepContent = () => {
    switch (formStep) {
      case 1:
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Location
              </label>
              <div className="bg-gray-100 p-3 rounded text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>
                  Lat: {location?.latitude.toFixed(6)}, Lng: {location?.longitude.toFixed(6)}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Crime Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {crimeTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      formData.type === type.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl mb-1">{type.icon}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
              {validationErrors.type && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.type}</p>
              )}
            </div>
          </>
        );
      
      case 2:
        return (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                validationErrors.description ? 'border-red-500' : ''
              }`}
              placeholder="Describe what happened in detail... When did it occur? Were there any witnesses?"
              required
            ></textarea>
            {validationErrors.description && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Characters: {formData.description.length} (minimum 10)
            </p>
          </div>
        );
      
      case 3:
        return (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="media">
              Evidence (Optional)
            </label>
            <input
              type="file"
              id="media"
              onChange={handleFileChange}
              className="hidden"
              accept="image/jpeg,image/png,image/gif,video/mp4"
            />
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors">
              <button
                type="button"
                onClick={() => document.getElementById('media').click()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-sm mb-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Upload Photo/Video
              </button>
              <p className="text-sm text-gray-500">
                {formData.media ? formData.media.name : 'Drag and drop a file here, or click to browse'}
              </p>
            </div>
            
            {validationErrors.media && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.media}</p>
            )}
            
            {previewUrl && (
              <div className="mt-3">
                {previewUrl === 'video' ? (
                  <div className="bg-gray-200 rounded h-40 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600 ml-2">Video file selected</span>
                  </div>
                ) : (
                  <div className="rounded border border-gray-300 p-1">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-h-40 mx-auto rounded"
                    />
                  </div>
                )}
              </div>
            )}
            
            {isSubmitting && uploadProgress > 0 && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-right mt-1">
                  {uploadProgress === 100 ? 'Processing...' : `Uploading: ${uploadProgress}%`}
                </p>
              </div>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Review Your Report</h3>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">Type of Crime:</p>
                <p className="text-gray-800 capitalize">{formData.type}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-700">Description:</p>
                <p className="text-gray-800 text-sm">{formData.description}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-700">Location:</p>
                <p className="text-gray-800 text-sm">
                  Latitude: {location?.latitude.toFixed(6)}, 
                  Longitude: {location?.longitude.toFixed(6)}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-700">Evidence:</p>
                {formData.media ? (
                  <p className="text-gray-800 text-sm">{formData.media.name}</p>
                ) : (
                  <p className="text-gray-500 text-sm italic">No evidence attached</p>
                )}
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-700">Date and Time:</p>
                <p className="text-gray-800 text-sm">{format(formData.timestamp, 'PPpp')}</p>
              </div>
            </div>
            
            {validationErrors.submit && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-500 text-sm">{validationErrors.submit}</p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Report a Crime</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-1 ${
                    step < formStep ? 'bg-indigo-600 text-white' : 
                    step === formStep ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-600' : 
                    'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step < formStep ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : step}
                </div>
                <span className="text-xs text-gray-500">
                  {step === 1 && 'Type'}
                  {step === 2 && 'Details'}
                  {step === 3 && 'Evidence'}
                  {step === 4 && 'Review'}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${((formStep - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {renderStepContent()}
          
          <div className="flex justify-between mt-6">
            {formStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                disabled={isSubmitting}
              >
                Back
              </button>
            )}
            
            {formStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
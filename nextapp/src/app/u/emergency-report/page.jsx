'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmergencyReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [reportData, setReportData] = useState({
    incidentType: '',
    description: '',
    location: null,
    media: []
  });
  
  // Get current location on page load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          
          setReportData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Please allow location access.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setReportData(prev => ({
        ...prev,
        media: Array.from(files)
      }));
    } else {
      setReportData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('incidentType', reportData.incidentType);
      formData.append('description', reportData.description);
      
      if (reportData.location) {
        formData.append('location', JSON.stringify(reportData.location));
      }
      
      reportData.media.forEach((file, index) => {
        formData.append(`media_${index}`, file);
      });
      
      // Submit report
      const response = await fetch('/api/u/reports', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push(`/u/reports/${data.reportId}`);
      } else {
        throw new Error(data.error || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Report submission error:', error);
      alert('Failed to submit report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-red-600">
            Emergency Report
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Incident Type */}
              <div>
                <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700 mb-1">
                  Incident Type *
                </label>
                <select
                  id="incidentType"
                  name="incidentType"
                  value={reportData.incidentType}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select incident type</option>
                  <option value="assault">Assault</option>
                  <option value="theft">Theft</option>
                  <option value="harassment">Harassment</option>
                  <option value="vandalism">Vandalism</option>
                  <option value="domestic_violence">Domestic Violence</option>
                  <option value="public_disturbance">Public Disturbance</option>
                  <option value="suspicious_activity">Suspicious Activity</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={reportData.description}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe the incident in detail"
                  required
                ></textarea>
              </div>
              
              {/* Location */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Your Location
                  </label>
                  {!locationError && !currentLocation && (
                    <span className="text-xs text-gray-500">Detecting location...</span>
                  )}
                </div>
                
                {locationError ? (
                  <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
                    {locationError}
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="block mt-1 text-red-600 underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : currentLocation ? (
                  <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm">
                    Location detected successfully!
                    <p className="text-xs mt-1">
                      Coordinates: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                    </p>
                    <p className="text-xs mt-1">
                      Accuracy: ±{Math.round(currentLocation.accuracy)} meters
                    </p>
                  </div>
                ) : (
                  <div className="h-12 flex items-center justify-center border border-gray-300 rounded-md">
                    <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Media Upload */}
              <div>
                <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-1">
                  Evidence (Optional)
                </label>
                <input
                  id="media"
                  name="media"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  You can upload photos or videos as evidence (max 10MB each)
                </p>
                
                {reportData.media.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-700">
                      {reportData.media.length} file(s) selected
                    </p>
                  </div>
                )}
              </div>
              
              {/* Submit Button */}
              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                    loading || !currentLocation ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={loading || !currentLocation}
                >
                  {loading ? 'Submitting...' : 'Submit Emergency Report'}
                </button>
                
                <Link href="/u/dashboard">
                  <button
                    type="button"
                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
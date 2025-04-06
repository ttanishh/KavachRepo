'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';
import StationForm from '@/components/common/StationForm';

export default function EditPoliceStationPage({ params }) {
  const stationId = params.id;
  const [station, setStation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [districts, setDistricts] = useState([]);
  
  const router = useRouter();

  // Fetch station details
  useEffect(() => {
    const fetchStationDetails = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(`/api/sa/stations/${stationId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch station details');
        }
        
        setStation(data.station);
        
        // Fetch districts
        const districtsResponse = await fetch('/api/sa/districts');
        const districtsData = await districtsResponse.json();
        
        if (!districtsResponse.ok) {
          throw new Error(districtsData.message || 'Failed to fetch districts');
        }
        
        setDistricts(districtsData.districts);
      } catch (err) {
        console.error('Error fetching station details:', err);
        setError(err.message || 'Could not load station details.');
        toast.error('Error loading station');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStationDetails();
  }, [stationId]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/sa/stations/${stationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update police station');
      }
      
      toast.success('Police station updated successfully');
      router.push(`/sa/stations/${stationId}`);
    } catch (err) {
      console.error('Error updating station:', err);
      toast.error(err.message || 'Failed to update police station');
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading station details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto max-w-3xl">
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <button
            onClick={() => router.push('/sa/stations')}
            className="mt-2 text-sm font-medium text-danger-600 hover:text-danger-500 underline"
          >
            Return to Stations
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!station) {
    return (
      <div className="container mx-auto max-w-3xl">
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Station Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The police station you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/sa/stations')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Return to Stations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Police Station</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <StationForm
          initialData={station}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitLabel="Update Station"
          districts={districts}
        />
      </div>
    </div>
  );
}

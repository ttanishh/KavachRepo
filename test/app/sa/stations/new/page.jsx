'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';
import StationForm from '@/components/common/StationForm';

export default function NewPoliceStationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [districts, setDistricts] = useState([]);
  const router = useRouter();

  // Fetch districts list
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch('/api/sa/districts');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch districts');
        }
        
        setDistricts(data.districts);
      } catch (err) {
        console.error('Error fetching districts:', err);
        toast.error('Failed to load districts');
      }
    };
    
    fetchDistricts();
  }, []);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/sa/stations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create police station');
      }
      
      toast.success('Police station created successfully');
      router.push(`/sa/stations/${data.stationId}`);
    } catch (err) {
      console.error('Error creating station:', err);
      toast.error(err.message || 'Failed to create police station');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Police Station</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <StationForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitLabel="Create Station"
          districts={districts}
        />
      </div>
    </div>
  );
}

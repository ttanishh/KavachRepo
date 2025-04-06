'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiMapPin, FiPhone, FiMail, FiUsers, FiFileText, FiEdit, FiToggleLeft, FiToggleRight, FiUser } from 'react-icons/fi';
import Button from '@/components/common/Button';
import MapPicker from '@/components/common/MapPicker';
import StatsCard from '@/components/common/StatsCard';

export default function StationDetailPage({ params }) {
  const stationId = params.id;
  const [station, setStation] = useState(null);
  const [stationStats, setStationStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toggleLoading, setToggleLoading] = useState(false);
  
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
        setStationStats(data.stats);
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

  const handleToggleActive = async () => {
    if (!station) return;
    
    setToggleLoading(true);
    
    try {
      const response = await fetch(`/api/sa/stations/${stationId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !station.isActive }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update station status');
      }
      
      setStation(prev => ({
        ...prev,
        isActive: !prev.isActive
      }));
      
      toast.success(`Station ${!station.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      console.error('Error toggling station status:', err);
      toast.error(err.message || 'Failed to update station status');
    } finally {
      setToggleLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
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
      <div className="container mx-auto max-w-4xl py-8 px-4">
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
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Station Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The police station you're looking for doesn't exist or has been removed.
          </p>
          <Button
            variant="primary"
            onClick={() => router.push('/sa/stations')}
          >
            Return to Stations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-4 px-4">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Police Station Details</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {/* Station Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <div className="h-14 w-14 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                <FiMapPin className="h-7 w-7 text-primary-600 dark:text-primary-300" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {station.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {station.district} District
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 inline-flex items-center rounded-full text-sm font-medium ${
                station.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {station.isActive ? 'Active' : 'Inactive'}
              </span>
              
              <Button
                variant="outline"
                href={`/sa/stations/${stationId}/edit`}
              >
                <FiEdit className="mr-2" />
                Edit
              </Button>
              
              <Button
                variant={station.isActive ? 'danger' : 'primary'}
                onClick={handleToggleActive}
                isLoading={toggleLoading}
                disabled={toggleLoading}
              >
                {station.isActive ? (
                  <FiToggleRight className="mr-2" />
                ) : (
                  <FiToggleLeft className="mr-2" />
                )}
                {station.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Station Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Basic Information
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Station Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{station.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">District</p>
                      <p className="font-medium text-gray-900 dark:text-white">{station.district}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{station.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white">{station.phone || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                      <p className="font-medium text-gray-900 dark:text-white">{station.address}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Station Statistics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatsCard
                    title="Total Reports"
                    value={stationStats?.totalReports || 0}
                    icon={<FiFileText className="h-5 w-5" />}
                    variant="primary"
                  />
                  <StatsCard
                    title="Officers"
                    value={stationStats?.officerCount || 0}
                    icon={<FiUser className="h-5 w-5" />}
                    variant="secondary"
                  />
                  <StatsCard
                    title="Pending Cases"
                    value={stationStats?.pendingReports || 0}
                    icon={<FiFileText className="h-5 w-5" />}
                    variant="warning"
                  />
                </div>
              </div>
              
              {/* Station Administrators */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Station Administrators
                  </h3>
                  <Button
                    variant="outline"
                    href={`/sa/stations/${stationId}/admins/new`}
                    className="text-sm"
                  >
                    Add Admin
                  </Button>
                </div>
                
                {stationStats?.admins && stationStats.admins.length > 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                      {stationStats.admins.map(admin => (
                        <li key={admin.id} className="p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                              <FiUser className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{admin.fullName}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              className="text-xs"
                              href={`/sa/stations/${stationId}/admins/${admin.id}`}
                            >
                              View
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                    <p className="text-gray-600 dark:text-gray-400">No administrators assigned to this station yet.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Map */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Location
                </h3>
                <MapPicker
                  initialLocation={station.location}
                  height="250px"
                  interactive={false}
                  markers={[{ lat: station.location.lat, lng: station.location.lng, color: '#0ea5e9' }]}
                />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-start">
                  <FiMapPin className="mr-1 mt-1 flex-shrink-0" />
                  <span>{station.address}</span>
                </p>
              </div>
              
              {/* Actions */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    className="w-full"
                    href={`/sa/stations/${stationId}/reports`}
                  >
                    <FiFileText className="mr-2" />
                    View Reports
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    href={`/sa/stations/${stationId}/officers`}
                  >
                    <FiUsers className="mr-2" />
                    Manage Officers
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    href={`/sa/stations/${stationId}/edit`}
                  >
                    <FiEdit className="mr-2" />
                    Edit Details
                  </Button>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Contact Information</h3>
                <div className="space-y-3">
                  {station.phone && (
                    <div className="flex items-center text-sm">
                      <FiPhone className="mr-2 text-gray-500 dark:text-gray-400" />
                      <a href={`tel:${station.phone}`} className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                        {station.phone}
                      </a>
                    </div>
                  )}
                  
                  {station.email && (
                    <div className="flex items-center text-sm">
                      <FiMail className="mr-2 text-gray-500 dark:text-gray-400" />
                      <a href={`mailto:${station.email}`} className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                        {station.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

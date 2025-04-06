'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiSearch, FiFilter, FiAlertCircle, FiMapPin, FiPlusCircle } from 'react-icons/fi';
import Button from '@/components/common/Button';
import MapPicker from '@/components/common/MapPicker';

// Crime type color map for markers
const crimeTypeColors = {
  'Theft': '#f59e0b', // amber-500
  'Robbery': '#ef4444', // red-500
  'Assault': '#b91c1c', // red-700
  'Vandalism': '#8b5cf6', // violet-500
  'Fraud': '#0ea5e9', // sky-500
  'Harassment': '#ec4899', // pink-500
  'Domestic Violence': '#9f1239', // rose-800
  'Traffic Incident': '#6366f1', // indigo-500
  'Drug Related': '#7c3aed', // violet-600
  'Public Disturbance': '#4b5563', // gray-600
  'Missing Person': '#059669', // emerald-600
  'Other': '#6b7280', // gray-500
};

export default function CrimeMapPage() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 21.1702, lng: 72.8311 }); // Default to Surat
  const [filters, setFilters] = useState({
    timeframe: 'all',
    crimeType: 'all',
    radius: 10, // kilometers
  });
  
  const router = useRouter();

  // Try to get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Fetch nearby reports
  const fetchNearbyReports = async () => {
    setLoading(true);
    setError('');
    
    try {
      const queryParams = new URLSearchParams({
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: filters.radius,
        timeframe: filters.timeframe,
        crimeType: filters.crimeType !== 'all' ? filters.crimeType : ''
      });
      
      const response = await fetch(`/api/u/reports/nearby?${queryParams}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch nearby reports');
      }
      
      setReports(data.reports);
      applyFilters(data.reports);
    } catch (err) {
      console.error('Error fetching nearby reports:', err);
      setError(err.message || 'Failed to load crime reports.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch reports when user location or filters change
  useEffect(() => {
    if (userLocation) {
      fetchNearbyReports();
    }
  }, [userLocation, filters.radius, filters.timeframe, filters.crimeType]);

  // Apply filters to reports
  const applyFilters = (reportsList) => {
    let filtered = [...reportsList];
    
    // Additional filtering can be applied here if needed
    
    setFilteredReports(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format reports for map markers
  const getMapMarkers = () => {
    return filteredReports.map(report => ({
      lat: report.location.lat,
      lng: report.location.lng,
      color: crimeTypeColors[report.crimeType] || '#6b7280',
      popup: `
        <div class="font-medium">${report.title}</div>
        <div class="text-xs text-gray-500 mt-1">${report.crimeType} - ${new Date(report.timestamp).toLocaleDateString()}</div>
        <button class="text-xs text-primary-600 mt-2 view-report" data-id="${report.id}">View Details</button>
      `
    }));
  };

  // Handle marker popup click to view report details
  useEffect(() => {
    const handlePopupClick = (e) => {
      if (e.target.classList.contains('view-report')) {
        const reportId = e.target.getAttribute('data-id');
        router.push(`/u/reports/${reportId}`);
      }
    };
    
    document.addEventListener('click', handlePopupClick);
    
    return () => {
      document.removeEventListener('click', handlePopupClick);
    };
  }, [router]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crime Map</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View reported crimes in your area
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="w-40">
              <select
                name="timeframe"
                value={filters.timeframe}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="year">Past Year</option>
              </select>
            </div>
            
            <div className="w-40">
              <select
                name="crimeType"
                value={filters.crimeType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="Theft">Theft</option>
                <option value="Robbery">Robbery</option>
                <option value="Assault">Assault</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Fraud">Fraud</option>
                <option value="Harassment">Harassment</option>
                <option value="Domestic Violence">Domestic Violence</option>
                <option value="Traffic Incident">Traffic Incident</option>
                <option value="Drug Related">Drug Related</option>
                <option value="Public Disturbance">Public Disturbance</option>
                <option value="Missing Person">Missing Person</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="w-40">
              <select
                name="radius"
                value={filters.radius}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="1">1 km radius</option>
                <option value="5">5 km radius</option>
                <option value="10">10 km radius</option>
                <option value="25">25 km radius</option>
                <option value="50">50 km radius</option>
              </select>
            </div>
            
            <Button
              href="/u/reports/new"
              variant="primary"
            >
              <FiPlusCircle className="mr-2" />
              New Report
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative">
        {/* Map */}
        <MapPicker
          initialLocation={userLocation}
          onLocationChange={setUserLocation}
          height="100%"
          showSearch={true}
          markers={getMapMarkers()}
        />
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
              <span className="text-gray-900 dark:text-white">Loading crime data...</span>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-danger-100 border border-danger-200 text-danger-700 px-4 py-3 rounded shadow-md">
            <div className="flex items-center">
              <FiAlertCircle className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Crime count badge */}
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {filteredReports.length} {filteredReports.length === 1 ? 'Crime' : 'Crimes'} Reported
          </div>
        </div>
        
        {/* Color legend */}
        <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md max-w-xs">
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Crime Types</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(crimeTypeColors).map(([type, color]) => (
              <div key={type} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

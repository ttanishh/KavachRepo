'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FiUsers, FiMapPin, FiActivity, FiFileText, FiAlertTriangle, FiCheckCircle, FiRefreshCw, FiMap } from 'react-icons/fi';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import StatsCard from '@/components/common/StatsCard';
import Button from '@/components/common/Button';
import HeatmapChart from '@/components/common/HeatmapChart';
import MapPicker from '@/components/common/MapPicker';

export default function SuperAdminDashboardPage() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapMarkers, setMapMarkers] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/sa/dashboard');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }
      
      setDashboardStats(data.stats);
      
      // Create map markers for police stations
      if (data.stats.policeStations) {
        const markers = data.stats.policeStations.map(station => ({
          lat: station.location.lat,
          lng: station.location.lng,
          color: '#0ea5e9',
          popup: `
            <div class="font-medium">${station.name}</div>
            <div class="text-xs text-gray-500 mt-1">${station.district}</div>
            <a href="/sa/stations/${station.id}" class="text-xs text-primary-600 mt-2">View Details</a>
          `
        }));
        setMapMarkers(markers);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      toast.error('Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Loading state
  if (loading && !dashboardStats) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !dashboardStats) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-2 text-sm font-medium text-danger-600 hover:text-danger-500 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Overview of the entire Kavach crime reporting system
        </p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Police Stations"
          value={dashboardStats?.totalStations || 0}
          icon={<FiMapPin className="h-6 w-6" />}
          variant="primary"
        />
        
        <StatsCard
          title="Total Reports"
          value={dashboardStats?.totalReports || 0}
          icon={<FiFileText className="h-6 w-6" />}
          variant="secondary"
        />
        
        <StatsCard
          title="Active Users"
          value={dashboardStats?.activeUsers || 0}
          icon={<FiUsers className="h-6 w-6" />}
          variant="info"
        />
        
        <StatsCard
          title="Urgent Reports"
          value={dashboardStats?.urgentReports || 0}
          icon={<FiAlertTriangle className="h-6 w-6" />}
          variant="danger"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Reports Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Crime Reports Trend</h2>
            <button
              onClick={fetchDashboardData}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiRefreshCw className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <LineChart 
                data={dashboardStats?.reportsTrend || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#0ea5e9" name="Total Reports" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved Cases" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Station Performance */}
        <HeatmapChart
          data={dashboardStats?.stationPerformance || []}
          title="Station Performance"
          dataKey="station"
          stacked={false}
        />
      </div>
      
      {/* Police Stations Map */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FiMap className="text-primary-500 mr-2 h-5 w-5" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Police Stations Map</h2>
          </div>
          
          <Link href="/sa/stations" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
            Manage Stations
          </Link>
        </div>
        
        <div className="h-[400px] w-full mb-3">
          <MapPicker
            initialLocation={{ lat: 22.2587, lng: 71.1924 }} // Gujarat center
            interactive={true}
            showSearch={false}
            markers={mapMarkers}
            height="100%"
          />
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total {dashboardStats?.totalStations || 0} police stations registered across {dashboardStats?.totalDistricts || 0} districts
        </p>
      </div>
      
      {/* District-wise Statistics */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <HeatmapChart
          data={dashboardStats?.districtStats || []}
          title="District-wise Crime Statistics"
          dataKey="district"
        />
      </div>
      
      {/* Quick Access Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Button
          href="/sa/stations/new"
          variant="primary"
          className="flex items-center justify-center h-20"
        >
          <FiMapPin className="mr-2" />
          Add New Police Station
        </Button>
        
        <Button
          href="/sa/reports"
          variant="secondary"
          className="flex items-center justify-center h-20"
        >
          <FiFileText className="mr-2" />
          View All Reports
        </Button>
        
        <Button
          href="/sa/analytics"
          variant="outline"
          className="flex items-center justify-center h-20"
        >
          <FiActivity className="mr-2" />
          Advanced Analytics
        </Button>
        
        <Button
          href="/sa/users"
          variant="outline"
          className="flex items-center justify-center h-20"
        >
          <FiUsers className="mr-2" />
          Manage Users
        </Button>
      </div>
      
      {/* Critical Alerts */}
      <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <FiAlertTriangle className="text-danger-500 mr-2 h-5 w-5" />
          <h2 className="text-lg font-medium text-danger-700 dark:text-danger-400">Critical Alerts</h2>
        </div>
        
        {dashboardStats?.criticalAlerts && dashboardStats.criticalAlerts.length > 0 ? (
          <ul className="space-y-3">
            {dashboardStats.criticalAlerts.map((alert, index) => (
              <li key={index} className="flex items-start">
                <FiAlertTriangle className="text-danger-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-danger-700 dark:text-danger-400 font-medium">{alert.title}</p>
                  <p className="text-sm text-danger-600 dark:text-danger-300">{alert.description}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-danger-600 dark:text-danger-300">No critical alerts at this time.</p>
        )}
      </div>
    </div>
  );
}

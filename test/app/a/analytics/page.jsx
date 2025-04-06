'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiRefreshCw, FiCalendar, FiBarChart2, FiMap, FiPieChart, FiTrendingUp } from 'react-icons/fi';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Button from '@/components/common/Button';
import HeatmapChart from '@/components/common/HeatmapChart';
import MapPicker from '@/components/common/MapPicker';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('month');
  const [heatmapPoints, setHeatmapPoints] = useState([]);

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/a/reports/stats?timeRange=${timeRange}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch analytics data');
      }
      
      setStats(data);
      
      // Transform report locations for heatmap
      if (data.reportLocations) {
        const points = data.reportLocations.map(report => ({
          lat: report.location.lat,
          lng: report.location.lng,
          color: getCrimeTypeColor(report.crimeType),
          popup: `<strong>${report.crimeType}</strong><br/>${report.title}`
        }));
        setHeatmapPoints(points);
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.message || 'Failed to load analytics data.');
      toast.error('Error loading analytics');
    } finally {
      setLoading(false);
    }
  };

  // Get color for crime type (for map markers)
  const getCrimeTypeColor = (crimeType) => {
    const typeColors = {
      'Theft': '#0088FE',
      'Robbery': '#FF8042',
      'Assault': '#FF0000',
      'Vandalism': '#00C49F',
      'Fraud': '#FFBB28',
      'Harassment': '#8884d8',
      'Domestic Violence': '#FF00FF',
      'Traffic Incident': '#00FFFF',
      'Drug Related': '#82ca9d',
      'Public Disturbance': '#ffc658',
      'Missing Person': '#8B4513',
      'Other': '#808080',
    };
    
    return typeColors[crimeType] || '#808080';
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (loading && !stats) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !stats) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <button
            onClick={fetchAnalyticsData}
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crime Analytics</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            View and analyze crime trends in your jurisdiction
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <Button
            variant="outline"
            onClick={fetchAnalyticsData}
            className="inline-flex items-center"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Reports Over Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <FiTrendingUp className="text-primary-500 mr-2 h-5 w-5" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Reports Over Time</h2>
          </div>
          
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <LineChart
                data={stats?.reportsByDate || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#0ea5e9" name="Reports" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Crime Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <FiPieChart className="text-primary-500 mr-2 h-5 w-5" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Crime Type Distribution</h2>
          </div>
          
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats?.crimeTypeDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(stats?.crimeTypeDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Crime Map */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <FiMap className="text-primary-500 mr-2 h-5 w-5" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Crime Location Map</h2>
          </div>
          
          <div className="h-[400px] w-full">
            <MapPicker
              initialLocation={stats?.stationLocation || { lat: 21.1702, lng: 72.8311 }}
              interactive={true}
              showSearch={false}
              markers={heatmapPoints}
              height="100%"
            />
          </div>
          
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {Object.entries({
              'Theft': '#0088FE',
              'Robbery': '#FF8042',
              'Assault': '#FF0000',
              'Vandalism': '#00C49F',
              'Fraud': '#FFBB28',
              'Harassment': '#8884d8',
              'Other': '#808080',
            }).map(([type, color]) => (
              <div key={type} className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: color }}></div>
                <span className="truncate">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <FiBarChart2 className="text-primary-500 mr-2 h-5 w-5" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Report Status Distribution</h2>
          </div>
          
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart
                data={stats?.statusDistribution || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Reports" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Time of Day Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <FiCalendar className="text-primary-500 mr-2 h-5 w-5" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Time of Day Analysis</h2>
          </div>
          
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart
                data={stats?.timeOfDayDistribution || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Reports" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Crime Type by Area */}
      <div className="mt-6">
        <HeatmapChart
          data={stats?.crimeTypeByArea || []}
          title="Crime Type by Area"
          dataKey="area"
          height={350}
        />
      </div>
    </div>
  );
}

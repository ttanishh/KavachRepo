'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FiFileText, FiAlertTriangle, FiCheckCircle, FiClock, FiRefreshCw, FiActivity, FiMap } from 'react-icons/fi';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import StatsCard from '@/components/common/StatsCard';
import ReportCard from '@/components/common/ReportCard';
import HeatmapChart from '@/components/common/HeatmapChart';

export default function AdminDashboardPage() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/a/dashboard');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }
      
      setDashboardStats(data.stats);
      setRecentReports(data.recentReports);
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Welcome to the Police Station Admin Dashboard
        </p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Reports"
          value={dashboardStats?.totalReports || 0}
          icon={<FiFileText className="h-6 w-6" />}
          variant="primary"
        />
        
        <StatsCard
          title="Pending Reports"
          value={dashboardStats?.pendingReports || 0}
          icon={<FiClock className="h-6 w-6" />}
          variant="warning"
        />
        
        <StatsCard
          title="Active Investigations"
          value={dashboardStats?.investigatingReports || 0}
          icon={<FiActivity className="h-6 w-6" />}
          variant="info"
        />
        
        <StatsCard
          title="Resolved Cases"
          value={dashboardStats?.resolvedReports || 0}
          icon={<FiCheckCircle className="h-6 w-6" />}
          variant="success"
        />
      </div>
      
      {/* Reports Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
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
              <Line type="monotone" dataKey="urgent" stroke="#ef4444" name="Urgent Reports" />
              <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved Cases" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Reports */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Reports</h2>
            <Link href="/a/reports" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentReports.length > 0 ? (
              recentReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  role="admin"
                  className="border"
                  truncate={true}
                  showSummary={false}
                />
              ))
            ) : (
              <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400">No recent reports</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-center">
            <Link href="/a/reports" className="text-primary-600 hover:text-primary-500 font-medium">
              View All Reports
            </Link>
          </div>
        </div>
        
        {/* Crime Type Distribution */}
        <HeatmapChart
          data={dashboardStats?.crimeTypeDistribution || []}
          title="Crime Type Distribution"
          dataKey="crimeType"
          stacked={false}
        />
      </div>
      
      {/* Urgent Attention Needed */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center mb-4">
          <FiAlertTriangle className="text-danger-500 mr-2 h-5 w-5" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Urgent Attention Needed</h2>
        </div>
        
        <div className="space-y-4">
          {dashboardStats?.urgentReports && dashboardStats.urgentReports.length > 0 ? (
            dashboardStats.urgentReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                role="admin"
                className="border border-danger-200 bg-danger-50 dark:bg-danger-900/20"
              />
            ))
          ) : (
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">No urgent reports requiring attention</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Crime Hotspot Map Link */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-white mb-4 md:mb-0">
            <h2 className="text-xl font-semibold mb-2">View Crime Hotspots</h2>
            <p>Analyze crime patterns and hotspots in your jurisdiction</p>
          </div>
          
          <Link
            href="/a/analytics"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiMap className="mr-2" />
            Open Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}

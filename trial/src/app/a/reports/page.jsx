'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiFilter, FiSearch, FiRefreshCw, FiList, FiGrid } from 'react-icons/fi';
import Button from '@/components/common/Button';
import ReportCard from '@/components/common/ReportCard';

const crimeTypes = [
  'All Types',
  'Theft',
  'Robbery',
  'Assault',
  'Vandalism',
  'Fraud',
  'Harassment',
  'Domestic Violence',
  'Traffic Incident',
  'Drug Related',
  'Public Disturbance',
  'Missing Person',
  'Other'
];

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filters, setFilters] = useState({
    status: 'all',
    crimeType: 'All Types',
    timeframe: 'all',
    search: '',
  });
  const [error, setError] = useState('');

  // Fetch station's reports
  const fetchReports = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/a/reports');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch reports');
      }
      
      setReports(data.reports);
      applyFilters(data.reports);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again.');
      toast.error('Error loading reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Apply filters to reports
  const applyFilters = (reportsList = reports) => {
    let filtered = [...reportsList];
    
    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(report => report.status === filters.status);
    }
    
    // Filter by crime type
    if (filters.crimeType !== 'All Types') {
      filtered = filtered.filter(report => report.crimeType === filters.crimeType);
    }
    
    // Filter by timeframe
    if (filters.timeframe !== 'all') {
      const now = new Date();
      let threshold = new Date();
      
      switch (filters.timeframe) {
        case 'today':
          threshold.setHours(0, 0, 0, 0);
          break;
        case 'week':
          threshold.setDate(now.getDate() - 7);
          break;
        case 'month':
          threshold.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          threshold.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(report => {
        const reportDate = report.timestamp instanceof Date 
          ? report.timestamp 
          : new Date(report.timestamp);
        return reportDate >= threshold;
      });
    }
    
    // Filter by search query
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(query) || 
        report.description.toLowerCase().includes(query) ||
        (report.address && report.address.toLowerCase().includes(query)) ||
        (report.reporter && report.reporter.fullName && report.reporter.fullName.toLowerCase().includes(query))
      );
    }
    
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

  // Apply filters when filters state changes
  useEffect(() => {
    applyFilters();
  }, [filters]);

  // Handle search input
  const handleSearch = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crime Reports</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage and investigate crime reports assigned to your station
        </p>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Search reports..."
                value={filters.search}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          <div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div>
            <select
              name="crimeType"
              value={filters.crimeType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              {crimeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              name="timeframe"
              value={filters.timeframe}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* View toggle and refresh */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredReports.length} of {reports.length} reports
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-1 flex">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              aria-label="Grid view"
            >
              <FiGrid className="text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              aria-label="List view"
            >
              <FiList className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <button
            onClick={fetchReports}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Refresh"
          >
            <FiRefreshCw className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Error state */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <button
            onClick={fetchReports}
            className="mt-2 text-sm font-medium text-danger-600 hover:text-danger-500 underline"
          >
            Try again
          </button>
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading reports...</p>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && filteredReports.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="inline-block p-3 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <FiFilter className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No matching reports</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your filters to find what you're looking for
          </p>
          <button
            onClick={() => {
              setFilters({
                status: 'all',
                crimeType: 'All Types',
                timeframe: 'all',
                search: '',
              });
            }}
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
      
      {/* Reports grid/list */}
      {!loading && filteredReports.length > 0 && (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                role="admin"
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Report
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{report.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{report.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{report.crimeType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          report.status === 'investigating' ? 'bg-blue-100 text-blue-800' : 
                          report.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                          report.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {report.status?.charAt(0).toUpperCase() + report.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(report.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {report.isAnonymous ? "Anonymous" : report.reporter?.fullName || "Unknown"}
                      </div>
                      {!report.isAnonymous && report.reporter?.phone && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">{report.reporter.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        href={`/a/reports/${report.id}`}
                        variant="outline"
                        className="text-xs"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

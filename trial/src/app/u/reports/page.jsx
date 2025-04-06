'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FiPlusCircle, FiFilter, FiSearch, FiRefreshCw } from 'react-icons/fi';
import Button from '@/components/common/Button';
import ReportCard from '@/components/common/ReportCard';

export default function UserReportsPage() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // Fetch user's reports
  const fetchReports = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/u/reports');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch reports');
      }
      
      setReports(data.reports);
      setFilteredReports(data.reports);
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

  // Filter and search reports
  useEffect(() => {
    let result = [...reports];
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(report => report.status === filter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(report => 
        report.title.toLowerCase().includes(query) || 
        report.description.toLowerCase().includes(query) ||
        (report.address && report.address.toLowerCase().includes(query)) ||
        (report.crimeType && report.crimeType.toLowerCase().includes(query))
      );
    }
    
    setFilteredReports(result);
  }, [filter, searchQuery, reports]);

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Crime Reports</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            View and manage all your submitted crime reports
          </p>
        </div>
        
        <Button
          href="/u/reports/new"
          variant="primary"
          className="mt-4 md:mt-0"
        >
          <FiPlusCircle className="mr-2" />
          New Report
        </Button>
      </div>
      
      {/* Filters and search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none dark:bg-gray-700 dark:text-white"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Reports</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={fetchReports}
            className="md:w-12 flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Refresh"
          >
            <FiRefreshCw className="text-gray-500 dark:text-gray-400" />
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
          <p className="text-gray-600 dark:text-gray-400">Loading your reports...</p>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && filteredReports.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {searchQuery || filter !== 'all' ? (
            <>
              <div className="inline-block p-3 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <FiFilter className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No matching reports</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search or filter to find what you're looking for
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilter('all');
                }}
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <div className="inline-block p-3 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <FiPlusCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No reports yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't submitted any crime reports yet
              </p>
              <Link
                href="/u/reports/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiPlusCircle className="mr-2" />
                Create a new report
              </Link>
            </>
          )}
        </div>
      )}
      
      {/* Reports grid */}
      {!loading && filteredReports.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              role="user"
            />
          ))}
        </div>
      )}
    </div>
  );
}

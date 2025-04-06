// components/u/ReportList.jsx
import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export function ReportList({ reports = [], isLoading = false, className = '', ...props }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="text-center py-10 border border-dashed border-surface-200 rounded-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mx-auto text-surface-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-surface-900 mb-1">No reports yet</h3>
        <p className="text-surface-500 mb-4">Your reports will appear here once you've submitted them.</p>
        <Link 
          href="/u/reports/new" 
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          Create your first report
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Link 
          key={report.id} 
          href={`/u/reports/${report.id}`}
          className="block transition-all hover:shadow-md"
        >
          <div className="border border-surface-200 rounded-lg p-4 hover:border-primary-300">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-surface-900">{report.title}</h3>
                <p className="text-sm text-surface-500 line-clamp-1 mt-1">{report.description}</p>
              </div>
              
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                {formatStatus(report.status)}
              </span>
            </div>
            
            <div className="flex items-center mt-4 text-sm text-surface-500">
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(report.createdAt)}
              </div>
              
              <div className="mx-3">•</div>
              
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {report.address}
              </div>
              
              <div className="mx-3">•</div>
              
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {report.crimeType}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Helper functions for formatting status
function formatStatus(status) {
  const statusMap = {
    new: 'New',
    in_review: 'In Review',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
    rejected: 'Rejected'
  };
  
  return statusMap[status] || status;
}

function getStatusColor(status) {
  const colorMap = {
    new: 'bg-blue-100 text-blue-800',
    in_review: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800'
  };
  
  return colorMap[status] || 'bg-blue-100 text-blue-800';
}
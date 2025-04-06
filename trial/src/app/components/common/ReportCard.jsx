import React from 'react';
import Link from 'next/link';
import { FiClock, FiMapPin, FiTag, FiFileText, FiArrowRight } from 'react-icons/fi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  investigating: 'bg-blue-100 text-blue-800 border-blue-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-gray-100 text-gray-800 border-gray-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  
  const date = typeof timestamp === 'object' ? 
    timestamp.toDate() : 
    new Date(timestamp);
    
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const ReportCard = ({ 
  report, 
  role = 'user', 
  hideActions = false,
  showSummary = true,
  truncate = true,
  className = '',
}) => {
  if (!report) return null;
  
  const { 
    id, 
    title, 
    description, 
    status = 'pending', 
    crimeType, 
    createdAt, 
    location,
    address, 
  } = report;
  
  const detailsPath = role === 'admin' ? `/a/reports/${id}` : 
                       role === 'superadmin' ? `/sa/reports/${id}` : 
                       `/u/reports/${id}`;
  
  return (
    <div className={`border rounded-lg shadow-sm bg-white dark:bg-gray-800 overflow-hidden ${className}`}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {truncate && title.length > 50 ? `${title.substring(0, 50)}...` : title}
          </h3>
          
          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        
        {showSummary && (
          <p className={`mt-2 text-gray-600 dark:text-gray-300 ${truncate ? 'line-clamp-2' : ''}`}>
            {description}
          </p>
        )}
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FiClock className="mr-2" />
            <span>{formatDate(createdAt)}</span>
          </div>
          
          {crimeType && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FiTag className="mr-2" />
              <span>{crimeType}</span>
            </div>
          )}
          
          {(location || address) && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FiMapPin className="mr-2 flex-shrink-0" />
              <span className="truncate">
                {address || `${location?.lat.toFixed(6)}, ${location?.lng.toFixed(6)}`}
              </span>
            </div>
          )}
        </div>
        
        {!hideActions && (
          <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              href={detailsPath}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              <FiFileText className="mr-2" />
              View Details
              <FiArrowRight className="ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCard;

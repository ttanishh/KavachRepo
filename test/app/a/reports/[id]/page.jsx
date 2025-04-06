'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiMapPin, FiClock, FiTag, FiCheckCircle, FiAlertCircle, FiPhone, FiMail, FiUser, FiFileText, FiMessageSquare, FiDownload } from 'react-icons/fi';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import FormError from '@/components/common/FormError';
import MapPicker from '@/components/common/MapPicker';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  investigating: 'bg-blue-100 text-blue-800 border-blue-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-gray-100 text-gray-800 border-gray-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons = {
  pending: <FiClock className="h-5 w-5" />,
  investigating: <FiAlertCircle className="h-5 w-5" />,
  resolved: <FiCheckCircle className="h-5 w-5" />,
  closed: <FiCheckCircle className="h-5 w-5" />,
  rejected: <FiAlertCircle className="h-5 w-5" />,
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

export default function AdminReportDetailPage({ params }) {
  const reportId = params.id;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusData, setStatusData] = useState({
    status: '',
    note: '',
  });
  
  const router = useRouter();

  // Fetch report details
  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const response = await fetch(`/api/a/reports/${reportId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch report details');
        }
        
        setReport(data.report);
        setMediaFiles(data.media || []);
        setUpdates(data.updates || []);
        setStatusData({ status: data.report.status, note: '' });
      } catch (err) {
        console.error('Error fetching report details:', err);
        setError(err.message || 'Could not load report details.');
        toast.error('Error loading report');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportDetails();
  }, [reportId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    setSubmittingComment(true);
    
    try {
      const response = await fetch(`/api/a/reports/${reportId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add comment');
      }
      
      // Update updates list with new comment
      setUpdates(prev => [...prev, data.comment]);
      setComment('');
      toast.success('Comment added successfully');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error(err.message || 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStatusChange = (e) => {
    setStatusData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    
    if (!statusData.status) {
      toast.error('Please select a status');
      return;
    }
    
    setUpdatingStatus(true);
    
    try {
      const response = await fetch(`/api/a/reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }
      
      // Update report status locally
      setReport(prev => ({
        ...prev,
        status: statusData.status
      }));
      
      // Add the update to updates list
      if (data.update) {
        setUpdates(prev => [...prev, data.update]);
      }
      
      toast.success('Status updated successfully');
      setShowStatusUpdate(false);
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading report details...</p>
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
            onClick={() => router.push('/a/reports')}
            className="mt-2 text-sm font-medium text-danger-600 hover:text-danger-500 underline"
          >
            Return to Reports
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!report) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Report Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The report you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button
            variant="primary"
            onClick={() => router.push('/a/reports')}
          >
            Return to Reports
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Report Details</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {/* Report Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {report.title}
              </h2>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <FiClock className="mr-1" />
                  <span>{formatDate(report.createdAt || report.timestamp)}</span>
                </div>
                
                {report.crimeType && (
                  <div className="flex items-center">
                    <FiTag className="mr-1" />
                    <span>{report.crimeType}</span>
                  </div>
                )}
                
                {report.isUrgent && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800 border border-danger-200">
                    <FiAlertCircle className="mr-1" />
                    Urgent
                  </span>
                )}
                
                {report.isAnonymous && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                    Anonymous
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors[report.status || 'pending']}`}>
                {statusIcons[report.status || 'pending']}
                <span className="ml-1 capitalize">{report.status || 'Pending'}</span>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowStatusUpdate(!showStatusUpdate)}
              >
                Update Status
              </Button>
            </div>
          </div>
          
          {/* Status Update Form */}
          {showStatusUpdate && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Update Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={statusData.status}
                      onChange={handleStatusChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="investigating">Investigating</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status Note (Optional)
                    </label>
                    <input
                      type="text"
                      id="note"
                      name="note"
                      value={statusData.note}
                      onChange={handleStatusChange}
                      placeholder="Add a note about this status update"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowStatusUpdate(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={updatingStatus}
                    disabled={updatingStatus || !statusData.status}
                  >
                    Update Status
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        {/* Report Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {report.description}
                </p>
              </div>
              
              {/* Media Gallery */}
              {mediaFiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Evidence & Media
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {mediaFiles.map((file, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                        {file.type?.includes('image') ? (
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <img
                              src={file.url}
                              alt={`Evidence ${index + 1}`}
                              className="w-full h-32 object-cover"
                            />
                          </a>
                        ) : file.type?.includes('video') ? (
                          <video
                            src={file.url}
                            className="w-full h-32 object-cover"
                            controls
                          />
                        ) : (
                          <div className="flex items-center justify-center h-32 bg-gray-200 dark:bg-gray-700">
                            <FiFileText className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        
                        <a
                          href={file.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FiDownload className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Updates & Comments */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Updates & Communication
                </h3>
                
                {updates.length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      No updates yet. Add a comment to communicate with the reporter.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {updates.map((update, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-md border ${
                          update.type === 'system' 
                            ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' 
                            : update.fromPolice 
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                              : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                              update.type === 'system' 
                                ? 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300' 
                                : update.fromPolice
                                  ? 'bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-200'
                                  : 'bg-primary-200 dark:bg-primary-700 text-primary-700 dark:text-primary-200'
                            }`}>
                              {update.type === 'system' ? (
                                <FiAlertCircle className="h-4 w-4" />
                              ) : update.fromPolice ? (
                                <FiUser className="h-4 w-4" />
                              ) : (
                                <FiMessageSquare className="h-4 w-4" />
                              )}
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                              {update.type === 'system' ? 'System' : update.fromPolice ? 'Police Officer' : 'Reporter'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(update.timestamp)}
                          </span>
                        </div>
                        <div className="mt-2 text-gray-700 dark:text-gray-300">
                          {update.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add Comment Form */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Add a Comment
                  </h4>
                  <form onSubmit={handleAddComment}>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      rows="3"
                      placeholder="Type your message to the reporter here..."
                    />
                    <div className="mt-2 flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={submittingComment}
                        disabled={submittingComment || !comment.trim()}
                      >
                        Send Comment
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Report Information</h3>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${statusColors[report.status || 'pending']}`}>
                  {statusIcons[report.status || 'pending']}
                  <span className="ml-1 capitalize">{report.status || 'Pending'}</span>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Report ID: {reportId.slice(0, 8)}</p>
                  <p>Submitted: {formatDate(report.createdAt || report.timestamp)}</p>
                  {report.updatedAt && <p>Last updated: {formatDate(report.updatedAt)}</p>}
                </div>
              </div>
              
              {/* Reporter Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Reporter Information</h3>
                
                {report.isAnonymous ? (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-sm text-gray-600 dark:text-gray-400">
                    <p>This report was submitted anonymously</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {report.reporter?.fullName && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FiUser className="mr-2 text-gray-500" />
                        <span>{report.reporter.fullName}</span>
                      </div>
                    )}
                    
                    {report.reporter?.phone && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FiPhone className="mr-2 text-gray-500" />
                        <a href={`tel:${report.reporter.phone}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                          {report.reporter.phone}
                        </a>
                      </div>
                    )}
                    
                    {report.reporter?.email && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FiMail className="mr-2 text-gray-500" />
                        <a href={`mailto:${report.reporter.email}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                          {report.reporter.email}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Location Map */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Incident Location</h3>
                {report.location ? (
                  <>
                    <MapPicker
                      initialLocation={report.location}
                      height="200px"
                      interactive={false}
                      markers={[{ lat: report.location.lat, lng: report.location.lng, color: '#ef4444' }]}
                    />
                    {report.address && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-start">
                        <FiMapPin className="mr-1 mt-1 flex-shrink-0" />
                        <span>{report.address}</span>
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No location information available
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  href={`/a/reports/${reportId}/assign`}
                >
                  Assign Officer
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  href={`/a/reports/${reportId}/related`}
                >
                  Find Related Cases
                </Button>
                
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => {
                    // Flag report logic would go here
                    toast.success('Report has been flagged for review');
                  }}
                >
                  Flag Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

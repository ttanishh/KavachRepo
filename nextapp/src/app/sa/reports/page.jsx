'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Badge } from '@/components/common/Badge';
import { Pagination } from '@/components/common/Pagination';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { ExportButton } from '@/components/sa/ExportButton';

// Mock reports data
const reports = [
  {
    id: 'RPT123456',
    title: 'Mobile Phone Theft',
    reportedBy: 'Rahul Kumar',
    station: 'Central Police Station, Mumbai',
    state: 'Maharashtra',
    location: 'City Mall, Fort Area, Mumbai',
    crimeType: 'Theft',
    status: 'resolved',
    priority: 'medium',
    assignedTo: 'Inspector Sharma',
    createdAt: '2025-03-30T14:30:00Z',
    resolvedAt: '2025-04-02T09:15:00Z',
  },
  {
    id: 'RPT789012',
    title: 'Traffic Signal Not Working',
    reportedBy: 'Priya Desai',
    station: 'MG Road Police Station, Delhi',
    state: 'Delhi',
    location: 'MG Road, Connaught Place, Delhi',
    crimeType: 'Public Nuisance',
    status: 'new',
    priority: 'low',
    assignedTo: null,
    createdAt: '2025-04-01T09:15:00Z',
    resolvedAt: null,
  },
  {
    id: 'RPT345678',
    title: 'Shop Burglary',
    reportedBy: 'Suresh Shah',
    station: 'Koramangala Police Station, Bangalore',
    state: 'Karnataka',
    location: 'Gandhi Market, Koramangala, Bangalore',
    crimeType: 'Burglary',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Officer Singh',
    createdAt: '2025-03-29T23:40:00Z',
    resolvedAt: null,
  },
  {
    id: 'RPT901234',
    title: 'Vehicle Accident',
    reportedBy: 'Amit Patel',
    station: 'Central Police Station, Ahmedabad',
    state: 'Gujarat',
    location: 'Ring Road, Navrangpura, Ahmedabad',
    crimeType: 'Accident',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Officer Kumar',
    createdAt: '2025-03-31T15:20:00Z',
    resolvedAt: null,
  },
  {
    id: 'RPT567890',
    title: 'Online Fraud',
    reportedBy: 'Neha Joshi',
    station: 'Cyber Crime Cell, Mumbai',
    state: 'Maharashtra',
    location: 'N/A (Online)',
    crimeType: 'Cybercrime',
    status: 'in_review',
    priority: 'medium',
    assignedTo: 'Cybercrime Team',
    createdAt: '2025-04-01T11:10:00Z',
    resolvedAt: null,
  },
  {
    id: 'RPT234567',
    title: 'Missing Person',
    reportedBy: 'Vikram Singh',
    station: 'Banjara Hills Police Station, Hyderabad',
    state: 'Telangana',
    location: 'Banjara Hills, Hyderabad',
    crimeType: 'Missing Person',
    status: 'assigned',
    priority: 'high',
    assignedTo: 'Inspector Reddy',
    createdAt: '2025-03-31T08:45:00Z',
    resolvedAt: null,
  },
  {
    id: 'RPT890123',
    title: 'Vandalism at Park',
    reportedBy: 'Raj Patel',
    station: 'Cubbon Park Police Station, Bangalore',
    state: 'Karnataka',
    location: 'Cubbon Park, Bangalore',
    crimeType: 'Vandalism',
    status: 'resolved',
    priority: 'low',
    assignedTo: 'Officer Gowda',
    createdAt: '2025-03-28T13:20:00Z',
    resolvedAt: '2025-03-30T16:45:00Z',
  },
  {
    id: 'RPT456789',
    title: 'Domestic Dispute',
    reportedBy: 'Anonymous',
    station: 'Egmore Police Station, Chennai',
    state: 'Tamil Nadu',
    location: 'Egmore, Chennai',
    crimeType: 'Domestic Violence',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Officer Lakshmi',
    createdAt: '2025-03-30T19:50:00Z',
    resolvedAt: null,
  },
  {
    id: 'RPT654321',
    title: 'Store Robbery',
    reportedBy: 'Manoj Tiwari',
    station: 'Salt Lake Police Station, Kolkata',
    state: 'West Bengal',
    location: 'Salt Lake City, Sector 5, Kolkata',
    crimeType: 'Robbery',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Inspector Banerjee',
    createdAt: '2025-04-02T21:15:00Z',
    resolvedAt: null,
  },
  {
    id: 'RPT987654',
    title: 'Car Theft',
    reportedBy: 'Rajeev Kapoor',
    station: 'Sector 17 Police Station, Chandigarh',
    state: 'Punjab',
    location: 'Sector 17, Chandigarh',
    crimeType: 'Theft',
    status: 'closed',
    priority: 'medium',
    assignedTo: 'Officer Singh',
    createdAt: '2025-03-25T09:30:00Z',
    resolvedAt: '2025-03-29T14:20:00Z',
  }
];

// Filter options
const crimeTypes = [
  { value: '', label: 'All Crime Types' },
  { value: 'theft', label: 'Theft' },
  { value: 'burglary', label: 'Burglary' },
  { value: 'robbery', label: 'Robbery' },
  { value: 'accident', label: 'Accident' },
  { value: 'cybercrime', label: 'Cybercrime' },
  { value: 'missing_person', label: 'Missing Person' },
  { value: 'vandalism', label: 'Vandalism' },
  { value: 'domestic_violence', label: 'Domestic Violence' },
  { value: 'public_nuisance', label: 'Public Nuisance' },
];

const statuses = [
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'in_review', label: 'In Review' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const priorities = [
  { value: '', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const states = [
  { value: '', label: 'All States' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Telangana', label: 'Telangana' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
  { value: 'West Bengal', label: 'West Bengal' },
  { value: 'Punjab', label: 'Punjab' },
];

export default function SuperAdminReports() {
  const [filters, setFilters] = useState({
    search: '',
    crimeType: '',
    status: '',
    priority: '',
    state: '',
    dateRange: { start: null, end: null }
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleDateRangeChange = (dateRange) => {
    setFilters(prev => ({
      ...prev,
      dateRange
    }));
    setCurrentPage(1);
  };
  
  const handleClearFilters = () => {
    setFilters({
      search: '',
      crimeType: '',
      status: '',
      priority: '',
      state: '',
      dateRange: { start: null, end: null }
    });
    setCurrentPage(1);
    setShowDatePicker(false);
  };
  
  // Apply filters
  const filteredReports = reports.filter(report => {
    // Search filter for title, ID, or reporter
    const searchMatch = filters.search === '' || 
      report.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.station.toLowerCase().includes(filters.search.toLowerCase());
    
    // Crime type filter
    const crimeTypeMatch = filters.crimeType === '' || 
      report.crimeType.toLowerCase().replace(' ', '_') === filters.crimeType.toLowerCase();
    
    // Status filter
    const statusMatch = filters.status === '' || 
      report.status === filters.status;
    
    // Priority filter
    const priorityMatch = filters.priority === '' || 
      report.priority === filters.priority;
    
    // State filter
    const stateMatch = filters.state === '' || 
      report.state === filters.state;
    
    // Date range filter
    let dateMatch = true;
    if (filters.dateRange.start && filters.dateRange.end) {
      const reportDate = new Date(report.createdAt);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      dateMatch = reportDate >= startDate && reportDate <= endDate;
    }
    
    return searchMatch && crimeTypeMatch && statusMatch && priorityMatch && stateMatch && dateMatch;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  // Get stats for the filtered reports
  const reportStats = {
    total: filteredReports.length,
    new: filteredReports.filter(r => r.status === 'new').length,
    inProgress: filteredReports.filter(r => ['in_review', 'assigned', 'in_progress'].includes(r.status)).length,
    resolved: filteredReports.filter(r => ['resolved', 'closed'].includes(r.status)).length,
    highPriority: filteredReports.filter(r => r.priority === 'high').length
  };
  
  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System-wide Reports</h1>
          <p className="text-surface-500 mt-1">
            View and manage all reports across the platform
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Date Range
          </Button>
          <ExportButton 
            data={filteredReports} 
            filename="all-reports" 
          />
        </div>
      </div>
      
      {showDatePicker && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <DateRangePicker
              value={filters.dateRange}
              onChange={handleDateRangeChange}
            />
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-surface-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-surface-600">Total Filtered</h3>
                <p className="text-2xl font-bold text-foreground mt-1">{reportStats.total}</p>
              </div>
              <div className="p-2 rounded-full bg-surface-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-surface-600">New</h3>
                <p className="text-2xl font-bold text-foreground mt-1">{reportStats.new}</p>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-warning-500 bg-opacity-10">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-surface-600">In Progress</h3>
                <p className="text-2xl font-bold text-foreground mt-1">{reportStats.inProgress}</p>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-success-500 bg-opacity-10">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-surface-600">Resolved</h3>
                <p className="text-2xl font-bold text-foreground mt-1">{reportStats.resolved}</p>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Input
                name="search"
                placeholder="Search by ID, title, reporter, or station..."
                value={filters.search}
                onChange={handleFilterChange}
                leadingIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-surface-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                }
              />
            </div>
            <Select
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              options={states}
              placeholder="Filter by state"
            />
            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={statuses}
              placeholder="Filter by status"
            />
            <div className="flex gap-2">
              <Select
                name="crimeType"
                value={filters.crimeType}
                onChange={handleFilterChange}
                options={crimeTypes}
                placeholder="Filter by crime type"
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="text-sm"
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Report ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Station</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Crime Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Reported On</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-surface-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReports.map((report) => (
                  <tr key={report.id} className="border-b border-surface-200 hover:bg-surface-50">
                    <td className="px-4 py-3 text-sm text-surface-600">{report.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{report.title}</p>
                        <p className="text-xs text-surface-500">By: {report.reportedBy}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-foreground truncate max-w-[200px]">{report.station}</p>
                        <p className="text-xs text-surface-500">{report.state}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-surface-600">{report.crimeType}</td>
                    <td className="px-4 py-3">
                      <Badge variant={
                        report.status === 'new' ? 'info' :
                        report.status === 'in_review' ? 'warning' :
                        report.status === 'assigned' ? 'info' :
                        report.status === 'in_progress' ? 'warning' :
                        report.status === 'resolved' ? 'success' :
                        'surface'
                      }>
                        {report.status.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          report.priority === 'high' ? 'bg-error-500' :
                          report.priority === 'medium' ? 'bg-warning-500' :
                          'bg-info-500'
                        }`}></span>
                        <span className="text-sm text-surface-600">
                          {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-surface-600">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/sa/reports/${report.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {paginatedReports.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-surface-500">
                      No reports found. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredReports.length > itemsPerPage && (
            <div className="p-4 border-t border-surface-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
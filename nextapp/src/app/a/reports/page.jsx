'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Badge } from '@/components/common/Badge';
import { Pagination } from '@/components/common/Pagination';
import { ExportButton } from '@/components/a/ExportButton';

// Mock data
const reports = [
  {
    id: 'RPT123456',
    title: 'Mobile Phone Theft',
    reportedBy: 'Rahul Kumar',
    location: 'City Mall, Ahmedabad',
    crimeType: 'Theft',
    status: 'in_review',
    priority: 'medium',
    assignedTo: 'Inspector Sharma',
    createdAt: '2025-03-30T14:30:00Z',
  },
  {
    id: 'RPT789012',
    title: 'Traffic Signal Not Working',
    reportedBy: 'Priya Desai',
    location: 'MG Road, Ahmedabad',
    crimeType: 'Public Nuisance',
    status: 'new',
    priority: 'low',
    assignedTo: null,
    createdAt: '2025-04-01T09:15:00Z',
  },
  {
    id: 'RPT345678',
    title: 'Shop Burglary',
    reportedBy: 'Suresh Shah',
    location: 'Gandhi Market, Ahmedabad',
    crimeType: 'Burglary',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Officer Singh',
    createdAt: '2025-03-29T23:40:00Z',
  },
  {
    id: 'RPT901234',
    title: 'Vehicle Accident',
    reportedBy: 'Amit Patel',
    location: 'Ring Road, Ahmedabad',
    crimeType: 'Accident',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Officer Kumar',
    createdAt: '2025-03-31T15:20:00Z',
  },
  {
    id: 'RPT567890',
    title: 'Online Fraud',
    reportedBy: 'Neha Joshi',
    location: 'N/A (Online)',
    crimeType: 'Cybercrime',
    status: 'new',
    priority: 'medium',
    assignedTo: null,
    createdAt: '2025-04-01T11:10:00Z',
  },
  {
    id: 'RPT234567',
    title: 'Missing Person',
    reportedBy: 'Vikram Singh',
    location: 'Satellite Area, Ahmedabad',
    crimeType: 'Missing Person',
    status: 'assigned',
    priority: 'high',
    assignedTo: 'Inspector Sharma',
    createdAt: '2025-03-31T08:45:00Z',
  },
  {
    id: 'RPT890123',
    title: 'Vandalism at Park',
    reportedBy: 'Raj Patel',
    location: 'City Park, Ahmedabad',
    crimeType: 'Vandalism',
    status: 'resolved',
    priority: 'low',
    assignedTo: 'Officer Patel',
    createdAt: '2025-03-28T13:20:00Z',
  },
  {
    id: 'RPT456789',
    title: 'Domestic Dispute',
    reportedBy: 'Anonymous',
    location: 'Navrangpura, Ahmedabad',
    crimeType: 'Domestic Violence',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Officer Mehra',
    createdAt: '2025-03-30T19:50:00Z',
  }
];

const crimeTypes = [
  { value: '', label: 'All Crime Types' },
  { value: 'theft', label: 'Theft' },
  { value: 'burglary', label: 'Burglary' },
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

export default function ReportsList() {
  const [filters, setFilters] = useState({
    search: '',
    crimeType: '',
    status: '',
    priority: '',
    dateRange: '',
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleClearFilters = () => {
    setFilters({
      search: '',
      crimeType: '',
      status: '',
      priority: '',
      dateRange: '',
    });
    setCurrentPage(1);
  };
  
  // Apply filters
  const filteredReports = reports.filter(report => {
    // Search filter for title, ID, or reporter
    const searchMatch = filters.search === '' || 
      report.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(filters.search.toLowerCase());
    
    // Crime type filter
    const crimeTypeMatch = filters.crimeType === '' || 
      report.crimeType.toLowerCase().replace(' ', '_') === filters.crimeType.toLowerCase();
    
    // Status filter
    const statusMatch = filters.status === '' || 
      report.status === filters.status;
    
    // Priority filter
    const priorityMatch = filters.priority === '' || 
      report.priority === filters.priority;
    
    return searchMatch && crimeTypeMatch && statusMatch && priorityMatch;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Assigned Reports</h1>
        <div className="flex space-x-2">
          <ExportButton data={filteredReports} filename="assigned-reports" />
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Report
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Input
                name="search"
                placeholder="Search reports by ID, title, or reporter..."
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
              name="crimeType"
              value={filters.crimeType}
              onChange={handleFilterChange}
              options={crimeTypes}
            />
            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={statuses}
            />
            <Select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              options={priorities}
            />
            <div className="md:col-span-4 lg:col-span-5 flex justify-end">
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="text-sm"
              >
                Clear Filters
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Reported By</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Crime Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Assigned To</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedReports.map((report) => (
                  <tr key={report.id} className="border-b border-surface-200 hover:bg-surface-50">
                    <td className="px-4 py-3 text-sm text-surface-600">{report.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{report.title}</td>
                    <td className="px-4 py-3 text-sm text-surface-600">{report.reportedBy}</td>
                    <td className="px-4 py-3 text-sm text-surface-600">{report.crimeType}</td>
                    <td className="px-4 py-3">
                      <Badge variant={
                        report.status === 'new' ? 'info' :
                        report.status === 'in_review' ? 'warning' :
                        report.status === 'assigned' ? 'info' :
                        report.status === 'in_progress' ? 'warning' :
                        report.status === 'resolved' ? 'success' :
                        'error'
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
                      {report.assignedTo || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-surface-600">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link 
                        href={`/a/reports/${report.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
                
                {paginatedReports.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-surface-500">
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
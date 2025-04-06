'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Badge } from '@/components/common/Badge';
import { Pagination } from '@/components/common/Pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/common/Dialog';
import { CreateStationForm } from '@/components/sa/CreateStationForm';

// Mock data
const stations = [
  { 
    id: 1, 
    name: 'Central Police Station', 
    state: 'Maharashtra', 
    city: 'Mumbai', 
    address: '123 Main St, Fort Area, Mumbai',
    status: 'active',
    officersCount: 52,
    reports: { total: 1245, pending: 128, resolved: 1117 },
    performance: { responseTime: 28, clearanceRate: 92 }
  },
  { 
    id: 2, 
    name: 'Koramangala Police Station', 
    state: 'Karnataka', 
    city: 'Bangalore', 
    address: '45 Garden Road, Koramangala, Bangalore',
    status: 'active',
    officersCount: 38,
    reports: { total: 986, pending: 95, resolved: 891 },
    performance: { responseTime: 32, clearanceRate: 89 }
  },
  { 
    id: 3, 
    name: 'MG Road Police Station', 
    state: 'Delhi', 
    city: 'New Delhi', 
    address: '789 MG Road, Connaught Place, New Delhi',
    status: 'active',
    officersCount: 45,
    reports: { total: 1122, pending: 156, resolved: 966 },
    performance: { responseTime: 35, clearanceRate: 86 }
  },
  { 
    id: 4, 
    name: 'Banjara Hills Police Station', 
    state: 'Telangana', 
    city: 'Hyderabad', 
    address: '22 Hill View, Banjara Hills, Hyderabad',
    status: 'active',
    officersCount: 36,
    reports: { total: 876, pending: 103, resolved: 773 },
    performance: { responseTime: 36, clearanceRate: 85 }
  },
  { 
    id: 5, 
    name: 'Central Police Station', 
    state: 'Gujarat', 
    city: 'Ahmedabad', 
    address: '56 River Front, Navrangpura, Ahmedabad',
    status: 'active',
    officersCount: 33,
    reports: { total: 798, pending: 127, resolved: 671 },
    performance: { responseTime: 37, clearanceRate: 84 }
  },
  { 
    id: 6, 
    name: 'Egmore Police Station', 
    state: 'Tamil Nadu', 
    city: 'Chennai', 
    address: '12 Mount Road, Egmore, Chennai',
    status: 'active',
    officersCount: 40,
    reports: { total: 912, pending: 143, resolved: 769 },
    performance: { responseTime: 34, clearanceRate: 82 }
  },
  { 
    id: 7, 
    name: 'Sector 17 Police Station', 
    state: 'Punjab', 
    city: 'Chandigarh', 
    address: 'Block D, Sector 17, Chandigarh',
    status: 'maintenance',
    officersCount: 28,
    reports: { total: 654, pending: 87, resolved: 567 },
    performance: { responseTime: 40, clearanceRate: 78 }
  },
  { 
    id: 8, 
    name: 'Salt Lake Police Station', 
    state: 'West Bengal', 
    city: 'Kolkata', 
    address: '33 Salt Lake City, Sector 5, Kolkata',
    status: 'active',
    officersCount: 35,
    reports: { total: 732, pending: 118, resolved: 614 },
    performance: { responseTime: 38, clearanceRate: 80 }
  },
  { 
    id: 9, 
    name: 'Cubbon Park Police Station', 
    state: 'Karnataka', 
    city: 'Bangalore', 
    address: '8 Park View Road, Cubbon Park, Bangalore',
    status: 'inactive',
    officersCount: 0,
    reports: { total: 0, pending: 0, resolved: 0 },
    performance: { responseTime: 0, clearanceRate: 0 }
  },
  { 
    id: 10, 
    name: 'Panjim Police Station', 
    state: 'Goa', 
    city: 'Panjim', 
    address: '9 Beach Road, Miramar, Panjim',
    status: 'active',
    officersCount: 25,
    reports: { total: 412, pending: 53, resolved: 359 },
    performance: { responseTime: 30, clearanceRate: 85 }
  }
];

// States filter options
const states = [
  { value: '', label: 'All States' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Telangana', label: 'Telangana' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
  { value: 'Punjab', label: 'Punjab' },
  { value: 'West Bengal', label: 'West Bengal' },
  { value: 'Goa', label: 'Goa' }
];

// Status filter options
const statuses = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'maintenance', label: 'Maintenance' }
];

// Performance filter options
const performanceFilters = [
  { value: '', label: 'All Performance' },
  { value: 'excellent', label: 'Excellent (90%+)' },
  { value: 'good', label: 'Good (80-90%)' },
  { value: 'average', label: 'Average (70-80%)' },
  { value: 'poor', label: 'Poor (<70%)' }
];

export default function StationsManagement() {
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    status: '',
    performance: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [createStationDialogOpen, setCreateStationDialogOpen] = useState(false);
  const itemsPerPage = 8;
  
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
      state: '',
      status: '',
      performance: ''
    });
    setCurrentPage(1);
  };
  
  // Apply filters
  const filteredStations = stations.filter(station => {
    // Search filter for name or city
    const searchMatch = filters.search === '' || 
      station.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      station.city.toLowerCase().includes(filters.search.toLowerCase());
    
    // State filter
    const stateMatch = filters.state === '' || 
      station.state === filters.state;
    
    // Status filter
    const statusMatch = filters.status === '' || 
      station.status === filters.status;
    
    // Performance filter
    let performanceMatch = true;
    if (filters.performance) {
      const clearanceRate = station.performance.clearanceRate;
      switch (filters.performance) {
        case 'excellent':
          performanceMatch = clearanceRate >= 90;
          break;
        case 'good':
          performanceMatch = clearanceRate >= 80 && clearanceRate < 90;
          break;
        case 'average':
          performanceMatch = clearanceRate >= 70 && clearanceRate < 80;
          break;
        case 'poor':
          performanceMatch = clearanceRate < 70;
          break;
      }
    }
    
    return searchMatch && stateMatch && statusMatch && performanceMatch;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
  const paginatedStations = filteredStations.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700">
            Police Stations Management
          </h1>
          <p className="text-surface-500 mt-1">Manage and monitor police stations across the country</p>
        </div>
        <Dialog open={createStationDialogOpen} onOpenChange={setCreateStationDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-md hover:shadow-lg transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Station
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Police Station</DialogTitle>
            </DialogHeader>
            <CreateStationForm onSubmit={() => setCreateStationDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-surface-50 to-white border-none shadow-md hover:shadow-lg transition-all">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-surface-600">Total Stations</h3>
                <p className="text-2xl font-bold text-foreground mt-1">{stations.length}</p>
              </div>
              <div className="p-3 rounded-full bg-primary-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary-50 to-white border-none shadow-md hover:shadow-lg transition-all">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-surface-600">Active Stations</h3>
                <p className="text-2xl font-bold text-primary-700 mt-1">
                  {stations.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-warning-50 to-white border-none shadow-md hover:shadow-lg transition-all">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-surface-600">In Maintenance</h3>
                <p className="text-2xl font-bold text-warning-700 mt-1">
                  {stations.filter(s => s.status === 'maintenance').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-warning-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-error-50 to-white border-none shadow-md hover:shadow-lg transition-all">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-surface-600">Inactive Stations</h3>
                <p className="text-2xl font-bold text-error-700 mt-1">
                  {stations.filter(s => s.status === 'inactive').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-error-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filters */}
      <Card className="mb-6 shadow-md border-none overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-surface-50 py-4 px-6 border-b border-surface-200">
          <CardTitle className="text-lg text-primary-700">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                name="search"
                placeholder="Search by station name or city..."
                value={filters.search}
                onChange={handleFilterChange}
                className="shadow-sm"
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
              className="shadow-sm"
            />
            <div className="flex gap-2">
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                options={statuses}
                className="flex-1 shadow-sm"
              />
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="text-sm shadow-sm hover:bg-surface-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stations Table */}
      <Card className="shadow-lg border-none overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-surface-50 py-4 px-6 border-b border-surface-200">
          <CardTitle className="text-lg text-primary-700">Police Stations List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-surface-600">Station Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-surface-600">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-surface-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-surface-600">Officers</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-surface-600">Reports</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-surface-600">Performance</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-surface-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStations.map((station) => (
                  <tr key={station.id} className="border-b border-surface-200 hover:bg-primary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{station.name}</p>
                        <p className="text-xs text-surface-500">ID: {station.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-foreground">{station.city}, {station.state}</p>
                        <p className="text-xs text-surface-500 truncate max-w-xs">{station.address}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        station.status === 'active' ? 'success' :
                        station.status === 'maintenance' ? 'warning' :
                        'error'
                      } className="shadow-sm">
                        {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-surface-100 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-surface-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="font-medium">{station.officersCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{station.reports.total.toLocaleString()} total</p>
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-warning-500 mr-1"></span>
                            <span className="text-surface-600">{station.reports.pending} pending</span>
                          </div>
                          <div className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-success-500 mr-1"></span>
                            <span className="text-surface-600">{station.reports.resolved} resolved</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-medium mr-2">{station.performance.clearanceRate}%</span>
                          <div className="w-24 bg-surface-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                station.performance.clearanceRate >= 90 ? 'bg-success-500' :
                                station.performance.clearanceRate >= 80 ? 'bg-info-500' :
                                station.performance.clearanceRate >= 70 ? 'bg-warning-500' :
                                'bg-error-500'
                              }`} 
                              style={{ width: `${station.performance.clearanceRate}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-xs text-surface-500 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {station.performance.responseTime} min avg. response
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/sa/stations/${station.id}`}
                          className="px-3 py-1 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-md text-sm font-medium transition-colors"
                        >
                          Details
                        </Link>
                        <Link 
                          href={`/sa/stations/${station.id}/edit`}
                          className="px-3 py-1 bg-surface-50 text-surface-600 hover:bg-surface-100 rounded-md text-sm font-medium transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {paginatedStations.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center justify-center text-surface-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-surface-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium mb-1">No stations found</p>
                        <p className="text-sm">Try adjusting your search filters</p>
                        <Button 
                          variant="outline" 
                          onClick={handleClearFilters}
                          className="mt-4"
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredStations.length > itemsPerPage && (
            <div className="p-6 border-t border-surface-200 flex justify-center">
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
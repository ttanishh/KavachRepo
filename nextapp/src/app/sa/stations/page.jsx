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
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Police Stations Management</h1>
        <Dialog open={createStationDialogOpen} onOpenChange={setCreateStationDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
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
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                name="search"
                placeholder="Search by station name or city..."
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
            />
            <div className="flex gap-2">
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                options={statuses}
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Station Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Officers</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Reports</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-500">Performance</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-surface-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStations.map((station) => (
                  <tr key={station.id} className="border-b border-surface-200 hover:bg-surface-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{station.name}</p>
                        <p className="text-xs text-surface-500">ID: {station.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-foreground">{station.city}, {station.state}</p>
                        <p className="text-xs text-surface-500 truncate max-w-xs">{station.address}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={
                        station.status === 'active' ? 'success' :
                        station.status === 'maintenance' ? 'warning' :
                        'error'
                      }>
                        {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {station.officersCount}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-foreground">{station.reports.total.toLocaleString()} total</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-warning-500">{station.reports.pending} pending</span>
                          <span className="text-success-500">{station.reports.resolved} resolved</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-medium mr-2">{station.performance.clearanceRate}%</span>
                          <div className="w-24 bg-surface-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                station.performance.clearanceRate >= 90 ? 'bg-success-500' :
                                station.performance.clearanceRate >= 80 ? 'bg-info-500' :
                                station.performance.clearanceRate >= 70 ? 'bg-warning-500' :
                                'bg-error-500'
                              }`} 
                              style={{ width: `${station.performance.clearanceRate}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-xs text-surface-500">
                          {station.performance.responseTime} min avg. response
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/sa/stations/${station.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Details
                        </Link>
                        <span className="text-surface-300">|</span>
                        <Link 
                          href={`/sa/stations/${station.id}/edit`}
                          className="text-surface-600 hover:text-surface-900 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {paginatedStations.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-surface-500">
                      No stations found. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredStations.length > itemsPerPage && (
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
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-surface-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-surface-600">Total Stations</h3>
                <p className="text-2xl font-bold text-foreground mt-1">{stations.length}</p>
              </div>
              <div className="p-2 rounded-full bg-surface-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-surface-600">Active Stations</h3>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stations.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-warning-500 bg-opacity-10">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-surface-600">In Maintenance</h3>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stations.filter(s => s.status === 'maintenance').length}
                </p>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-error-500 bg-opacity-10">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-surface-600">Inactive Stations</h3>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stations.filter(s => s.status === 'inactive').length}
                </p>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// components/a/FilterBar.jsx
import React, { useState } from 'react';
import { Button } from '../common/Button';

export function FilterBar({
  onFilterChange,
  className = '',
  ...props
}) {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    crimeType: '',
    searchQuery: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };
  
  const handleReset = () => {
    setFilters({
      status: '',
      dateRange: '',
      crimeType: '',
      searchQuery: '',
    });
    onFilterChange({});
  };
  
  return (
    <form 
      onSubmit={handleSubmit}
      className={`p-4 bg-surface-50 border border-surface-200 rounded-lg ${className}`}
      {...props}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-surface-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full rounded-md border-surface-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="in_review">In Review</option>
            <option value="assigned">Assigned</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="dateRange" className="block text-sm font-medium text-surface-700 mb-1">
            Date Range
          </label>
          <select
            id="dateRange"
            name="dateRange"
            value={filters.dateRange}
            onChange={handleChange}
            className="w-full rounded-md border-surface-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">This Year</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="crimeType" className="block text-sm font-medium text-surface-700 mb-1">
            Crime Type
          </label>
          <select
            id="crimeType"
            name="crimeType"
            value={filters.crimeType}
            onChange={handleChange}
            className="w-full rounded-md border-surface-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
          >
            <option value="">All Types</option>
            <option value="Theft">Theft</option>
            <option value="Robbery">Robbery</option>
            <option value="Assault">Assault</option>
            <option value="Vandalism">Vandalism</option>
            <option value="Cybercrime">Cybercrime</option>
            <option value="Traffic Violation">Traffic Violation</option>
            <option value="Public Nuisance">Public Nuisance</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="searchQuery" className="block text-sm font-medium text-surface-700 mb-1">
            Search
          </label>
          <input
            id="searchQuery"
            name="searchQuery"
            type="text"
            value={filters.searchQuery}
            onChange={handleChange}
            placeholder="Search by keyword..."
            className="w-full rounded-md border-surface-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-4 space-x-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button type="submit">
          Apply Filters
        </Button>
      </div>
    </form>
  );
}
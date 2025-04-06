// components/sa/StationList.jsx
import React, { useState } from 'react';
import { Table } from '../common/Table';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import Link from 'next/link';

export function StationList({
  stations = [],
  onDelete,
  isLoading = false,
  className = '',
  ...props
}) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredStations = stations.filter(
    station => station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               station.district.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (row) => (
        <div>
          <div className="font-medium text-surface-900">{row.name}</div>
          <div className="text-xs text-surface-500">Code: {row.code}</div>
        </div>
      )
    },
    {
      header: 'District',
      accessor: 'district',
    },
    {
      header: 'Reports',
      accessor: 'reportsCount',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.reportsCount}</div>
          <div className="text-xs text-surface-500">
            {row.pendingCount} pending
          </div>
        </div>
      )
    },
    {
      header: 'Officers',
      accessor: 'officersCount',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <Badge
          variant={row.status === 'active' ? 'success' : row.status === 'inactive' ? 'error' : 'warning'}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <Link href={`/sa/stations/${row.id}`}>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onDelete(row.id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];
  
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
  
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search stations..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="absolute left-3 top-2.5 text-surface-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <Link href="/sa/stations/new">
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Station
          </Button>
        </Link>
      </div>
      
      <Table
        columns={columns}
        data={filteredStations}
        emptyMessage="No stations found. Create a new station to get started."
      />
    </div>
  );
}
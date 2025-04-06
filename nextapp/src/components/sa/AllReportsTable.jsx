// components/sa/AllReportsTable.jsx
import React from 'react';
import { Table } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import Link from 'next/link';

export function AllReportsTable({
  reports = [],
  isLoading = false,
  onExport,
  className = '',
  ...props
}) {
  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      cell: (row) => (
        <span className="font-mono text-xs">{row.id.slice(0, 8)}</span>
      )
    },
    {
      header: 'Report',
      accessor: 'title',
      cell: (row) => (
        <div>
          <div className="font-medium text-surface-900">{row.title}</div>
          <div className="text-xs text-surface-500">{row.crimeType}</div>
        </div>
      )
    },
    {
      header: 'Reporter',
      accessor: 'reportedBy',
      cell: (row) => (
        <div>
          <div>{row.reportedBy?.name || 'Anonymous'}</div>
          <div className="text-xs text-surface-500">
            {row.reportedBy?.phone || ''}
          </div>
        </div>
      )
    },
    {
      header: 'Station',
      accessor: 'assignedStation',
      cell: (row) => (
        <div>
          <div>{row.assignedStation?.name || 'Unassigned'}</div>
          <div className="text-xs text-surface-500">
            {row.assignedStation?.district || ''}
          </div>
        </div>
      )
    },
    {
      header: 'Reported On',
      accessor: 'createdAt',
      cell: (row) => (
        <div className="text-sm">
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <StatusBadge status={row.status} />
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <Link href={`/sa/reports/${row.id}`}>
            <Button size="sm" variant="outline">
              View
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => window.alert(`Assign functionality for report ${row.id}`)}
          >
            Assign
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
        <h2 className="text-xl font-semibold">All Reports</h2>
        <div className="flex items-center space-x-2">
          <select
            className="rounded-md text-sm border-surface-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            defaultValue=""
          >
            <option value="">Filter by Status</option>
            <option value="new">New</option>
            <option value="in_review">In Review</option>
            <option value="assigned">Assigned</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          
          <select
            className="rounded-md text-sm border-surface-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            defaultValue=""
          >
            <option value="">Filter by Station</option>
            <option value="station1">Ahmedabad Central</option>
            <option value="station2">Surat City</option>
            <option value="station3">Vadodara East</option>
          </select>
          
          <Button
            variant="outline"
            onClick={onExport}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export
          </Button>
        </div>
      </div>
      
      <Table
        columns={columns}
        data={reports}
        emptyMessage="No reports found."
      />
    </div>
  );
}
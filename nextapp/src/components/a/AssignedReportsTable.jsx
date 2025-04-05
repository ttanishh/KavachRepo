// components/a/AssignedReportsTable.jsx
'use client'
import React, { useState } from 'react';
import { Table } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import Link from 'next/link';

export function AssignedReportsTable({
  reports = [],
  isLoading = false,
  onStatusChange,
  className = '',
  ...props
}) {
  const [selectedReports, setSelectedReports] = useState([]);
  
  const handleRowSelection = (reportId) => {
    setSelectedReports(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId);
      } else {
        return [...prev, reportId];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedReports.length === reports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reports.map(report => report.id));
    }
  };
  
  const columns = [
    {
      header: (
        <div className="flex items-center">
          <input
            type="checkbox"
            className="rounded text-primary-500 focus:ring-primary-500"
            checked={selectedReports.length === reports.length && reports.length > 0}
            onChange={handleSelectAll}
          />
        </div>
      ),
      cell: (row) => (
        <div className="flex items-center">
          <input
            type="checkbox"
            className="rounded text-primary-500 focus:ring-primary-500"
            checked={selectedReports.includes(row.id)}
            onChange={() => handleRowSelection(row.id)}
          />
        </div>
      )
    },
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
      header: 'Location',
      accessor: 'location',
      cell: (row) => (
        <div className="truncate max-w-xs" title={row.address}>
          {row.address}
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
          <Link href={`/a/reports/${row.id}`}>
            <Button size="sm" variant="outline">
              View
            </Button>
          </Link>
          <select
            className="rounded-md text-sm border-surface-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            value={row.status}
            onChange={(e) => onStatusChange(row.id, e.target.value)}
          >
            <option value="new">New</option>
            <option value="in_review">In Review</option>
            <option value="assigned">Assigned</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
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
        <div>
          {selectedReports.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-surface-500">
                {selectedReports.length} reports selected
              </span>
              <Button size="sm" variant="outline">
                Batch Update
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <select
            className="rounded-md text-sm border-surface-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            defaultValue=""
          >
            <option value="">Sort by</option>
            <option value="date_asc">Date (oldest first)</option>
            <option value="date_desc">Date (newest first)</option>
            <option value="status">Status</option>
          </select>
          <Button size="sm" variant="outline">
            Filter
          </Button>
        </div>
      </div>
      
      <Table
        columns={columns}
        data={reports}
        emptyMessage="No reports assigned to your station yet."
      />
    </div>
  );
}
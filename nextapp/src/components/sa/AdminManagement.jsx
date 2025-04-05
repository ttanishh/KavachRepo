// components/sa/AdminManagement.jsx
import React, { useState } from 'react';
import { Table } from '../common/Table';
import { Button } from '../common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';

export function AdminManagement({
  admins = [],
  onDelete,
  onEdit,
  onAdd,
  isLoading = false,
  className = '',
  ...props
}) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredAdmins = admins.filter(
    admin => admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
             admin.station?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const columns = [
    {
      header: 'Admin',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <Avatar src={row.avatar} name={row.name} size="sm" />
          <div>
            <div className="font-medium text-surface-900">{row.name}</div>
            <div className="text-xs text-surface-500">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: 'role',
      cell: (row) => (
        <Badge
          variant={row.role === 'superadmin' ? 'primary' : 'secondary'}
        >
          {row.role === 'superadmin' ? 'Super Admin' : 'Admin'}
        </Badge>
      )
    },
    {
      header: 'Assigned Station',
      accessor: 'station',
      cell: (row) => (
        <div>
          {row.station ? (
            <>
              <div>{row.station.name}</div>
              <div className="text-xs text-surface-500">
                {row.station.district}
              </div>
            </>
          ) : (
            <span className="text-surface-500">-</span>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <Badge
          variant={row.status === 'active' ? 'success' : 'error'}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      )
    },
    {
      header: 'Last Login',
      accessor: 'lastLogin',
      cell: (row) => (
        <div className="text-sm">
          {row.lastLogin ? new Date(row.lastLogin).toLocaleString() : 'Never'}
        </div>
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onEdit(row)}
          >
            Edit
          </Button>
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
    <Card className={className} {...props}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Admin Management</CardTitle>
          <Button onClick={onAdd}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Admin
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search admins..."
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
        
        <Table
          columns={columns}
          data={filteredAdmins}
          emptyMessage="No admins found."
        />
      </CardContent>
    </Card>
  );
}
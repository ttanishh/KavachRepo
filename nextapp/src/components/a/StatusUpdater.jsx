// components/a/StatusUpdater.jsx
import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';

export function StatusUpdater({
  reportId,
  currentStatus,
  onStatusUpdate,
  isLoading = false,
  className = '',
  ...props
}) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState('');
  
  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'in_review', label: 'In Review' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onStatusUpdate(reportId, status, note);
    setNote('');
  };
  
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Update Status</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Current Status
            </label>
            <StatusBadge status={currentStatus} className="text-sm" />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-surface-700 mb-1">
              New Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border-surface-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-surface-700 mb-1">
              Add Note (Optional)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-md border-surface-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              placeholder="Add a note about this status change..."
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || status === currentStatus}
            >
              Update Status
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
// components/common/StatusBadge.jsx
import React from 'react';
import { Badge } from './Badge';

export function StatusBadge({ status, className = '', ...props }) {
  const statusLabels = {
    new: 'New',
    in_review: 'In Review',
    assigned: 'Assigned',
    resolved: 'Resolved',
    closed: 'Closed'
  };
  
  return (
    <Badge 
      status={status} 
      className={className}
      {...props}
    >
      {statusLabels[status] || status}
    </Badge>
  );
}
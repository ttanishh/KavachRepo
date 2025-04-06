// components/u/StatusTimeline.jsx
import React from 'react';

export function StatusTimeline({
  events = [],
  className = '',
  ...props
}) {
  if (!events || events.length === 0) {
    return (
      <div className={`text-center py-4 text-surface-500 ${className}`} {...props}>
        No status updates yet.
      </div>
    );
  }

  // Status colors
  const statusColors = {
    new: 'bg-info-500',
    in_review: 'bg-secondary-500',
    assigned: 'bg-warning-500',
    resolved: 'bg-success-500',
    closed: 'bg-surface-500',
  };

  // Status labels
  const statusLabels = {
    new: 'Report Created',
    in_review: 'Under Review',
    assigned: 'Assigned to Officer',
    resolved: 'Case Resolved',
    closed: 'Case Closed',
  };

  return (
    <div className={`relative ${className}`} {...props}>
      {events.map((event, index) => (
        <div key={index} className="mb-6 last:mb-0">
          <div className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div className={`rounded-full h-4 w-4 ${statusColors[event.status] || 'bg-surface-400'}`}></div>
              {index < events.length - 1 && <div className="h-full border-l border-surface-200 my-1"></div>}
            </div>
            <div>
              <h4 className="text-sm font-medium text-surface-900">
                {statusLabels[event.status] || event.status}
              </h4>
              <time className="text-xs text-surface-500">
                {new Date(event.timestamp).toLocaleString()}
              </time>
              {event.note && (
                <p className="mt-1 text-sm text-surface-700">{event.note}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
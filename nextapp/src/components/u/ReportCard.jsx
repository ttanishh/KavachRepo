// components/u/ReportCard.jsx
import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Card, CardContent } from '../common/Card';
import Link from 'next/link';

export function ReportCard({
  report,
  className = '',
  ...props
}) {
  if (!report) return null;

  return (
    <Card 
      className={`overflow-hidden ${className}`}
      {...props}
    >
      <CardContent>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-surface-900">{report.title}</h3>
            <p className="text-sm text-surface-500 mt-1">
              Reported on {new Date(report.createdAt).toLocaleDateString()} • ID: {report.id.slice(0, 8)}
            </p>
          </div>
          <StatusBadge status={report.status} />
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-surface-500 mb-1">Crime Type</h4>
              <p className="text-surface-700">{report.crimeType}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-surface-500 mb-1">Location</h4>
              <p className="text-surface-700">{report.address}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-surface-500 mb-1">Description</h4>
          <p className="text-surface-700">{report.description}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-surface-200 flex justify-end">
          <Link
            href={`/u/reports/${report.id}`}
            className="text-sm font-medium text-primary-500 hover:text-primary-600"
          >
            View Full Details &rarr;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
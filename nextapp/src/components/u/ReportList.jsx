// components/u/ReportList.jsx
import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Card, CardContent } from '../common/Card';
import Link from 'next/link';

export function ReportList({
  reports = [],
  isLoading = false,
  className = '',
  ...props
}) {
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

  if (reports.length === 0) {
    return (
      <Card className={className} {...props}>
        <CardContent className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-surface-900 mb-2">No reports yet</h3>
          <p className="text-surface-500 mb-4">You haven't submitted any reports yet.</p>
          <Link 
            href="/u/reports/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create New Report
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {reports.map((report) => (
        <Link key={report.id} href={`/u/reports/${report.id}`} className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-surface-900">{report.title}</h3>
                  <p className="text-sm text-surface-500 mt-1">
                    Reported on {new Date(report.createdAt).toLocaleDateString()} • ID: {report.id.slice(0, 8)}
                  </p>
                  <p className="line-clamp-2 text-surface-700 mt-2">
                    {report.description}
                  </p>
                </div>
                <StatusBadge status={report.status} />
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-surface-200">
                <div className="text-sm text-surface-500">
                  {report.crimeType}
                </div>
                <div className="text-sm font-medium text-primary-500">
                  View Details &rarr;
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
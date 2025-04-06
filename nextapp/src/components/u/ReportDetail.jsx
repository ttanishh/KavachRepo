// components/u/ReportDetail.jsx
import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Map } from '../common/Map';
import { StatusTimeline } from './StatusTimeline';
import { MediaGallery } from './MediaGallery';
import { Breadcrumb } from '../common/Breadcrumb';

export function ReportDetail({
  report,
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

  if (!report) {
    return (
      <Card className={className} {...props}>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-surface-900 mb-2">Report not found</h3>
          <p className="text-surface-500">The report you are looking for doesn't exist or has been removed.</p>
        </CardContent>
      </Card>
    );
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/u/dashboard' },
    { label: 'My Reports', href: '/u/reports' },
    { label: `Report #${report.id.slice(0, 8)}` },
  ];

  return (
    <div className={`space-y-6 ${className}`} {...props}>
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-surface-900">{report.title}</h2>
        <StatusBadge status={report.status} className="mt-2 md:mt-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-surface-500">Reported On</h3>
                  <p className="mt-1">{new Date(report.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-surface-500">Crime Type</h3>
                  <p className="mt-1">{report.crimeType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-surface-500">Description</h3>
                  <p className="mt-1 whitespace-pre-line">{report.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-surface-500">Address</h3>
                  <p className="mt-1">{report.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {report.media && report.media.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Media Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <MediaGallery media={report.media} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <Map
                center={[report.location.lat, report.location.lng]}
                markers={[{ position: [report.location.lat, report.location.lng] }]}
                zoom={15}
                height="300px"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline events={report.statusHistory || []} />
            </CardContent>
          </Card>

          {report.assignedTo && (
            <Card>
              <CardHeader>
                <CardTitle>Assigned To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-surface-200 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-surface-900">{report.assignedTo.name}</h3>
                    <p className="text-sm text-surface-500">{report.assignedTo.position}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Report ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-surface-100 p-3 rounded font-mono text-sm">{report.id}</div>
              <p className="text-xs text-surface-500 mt-2">Use this ID when contacting authorities about this report.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
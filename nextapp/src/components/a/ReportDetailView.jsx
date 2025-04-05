// components/a/ReportDetailView.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { Map } from '../common/Map';
import { Breadcrumb } from '../common/Breadcrumb';
import { StatusUpdater } from './StatusUpdater';
import { NotesSection } from './NotesSection';
import { MediaGallery } from '../u/MediaGallery';

export function ReportDetailView({
  report,
  onStatusUpdate,
  onAddNote,
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
    { label: 'Dashboard', href: '/a/dashboard' },
    { label: 'Reports', href: '/a/reports' },
    { label: `Report #${report.id.slice(0, 8)}` },
  ];

  return (
    <div className={`space-y-6 ${className}`} {...props}>
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-surface-900">{report.title}</h2>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <StatusBadge status={report.status} />
          <Button variant="outline" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-surface-500">Reported By</h3>
                  <p className="mt-1">{report.reportedBy?.name || 'Anonymous'}</p>
                  {report.reportedBy?.phone && (
                    <p className="text-sm text-surface-500 mt-1">
                      {report.reportedBy.phone}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-surface-500">Reported On</h3>
                  <p className="mt-1">{new Date(report.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-surface-500">Crime Type</h3>
                  <p className="mt-1">{report.crimeType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-surface-500">Case ID</h3>
                  <p className="mt-1 font-mono">{report.id}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-surface-500">Description</h3>
                <p className="mt-1 whitespace-pre-line">{report.description}</p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-surface-500">Address</h3>
                <p className="mt-1">{report.address}</p>
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
          
          <NotesSection
            notes={report.notes || []}
            reportId={report.id}
            onAddNote={onAddNote}
          />
        </div>

        <div className="space-y-6">
          <StatusUpdater
            reportId={report.id}
            currentStatus={report.status}
            onStatusUpdate={onStatusUpdate}
          />

          <Card>
            <CardHeader>
              <CardTitle>Assigned Officer</CardTitle>
            </CardHeader>
            <CardContent>
              {report.assignedOfficer ? (
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-surface-200 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-surface-900">
                      {report.assignedOfficer.name}
                    </h3>
                    <p className="text-sm text-surface-500">
                      {report.assignedOfficer.badgeNumber}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-surface-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-center text-surface-500 mb-3">
                    No officer assigned to this case yet
                  </p>
                  <Button size="sm">
                    Assign Officer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule Follow-up
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Reporter
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
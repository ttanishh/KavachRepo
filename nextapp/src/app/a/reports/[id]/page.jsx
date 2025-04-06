'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { StatusTimeline } from '@/components/u/StatusTimeline';
import { StatusUpdater } from '@/components/a/StatusUpdater';
import { NotesSection } from '@/components/a/NotesSection';
import { MediaGallery } from '@/components/u/MediaGallery';
import { Map } from '@/components/common/Map';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';

// Mock data
const report = {
  id: 'RPT123456',
  title: 'Mobile Phone Theft',
  description: 'My iPhone 15 Pro was stolen at City Mall on Saturday evening around 6 PM. I was at the food court when someone took it from my table when I briefly stepped away. The phone is black in color and has a distinctive red case with my initials.',
  crimeType: 'Theft',
  status: 'in_review',
  createdAt: '2025-03-30T14:30:00Z',
  updatedAt: '2025-04-01T10:15:00Z',
  location: { lat: 23.0225, lng: 72.5714 },
  address: 'City Mall, Ahmedabad, Gujarat',
  reportedBy: {
    id: 'USR789012',
    name: 'Rahul Kumar',
    phone: '+91 9876543210',
    email: 'rahul.kumar@example.com',
    address: '123 Park Street, Ahmedabad, Gujarat',
    avatar: '/images/avatars/user-1.jpg'
  },
  assignedTo: {
    id: 'OFF123456',
    name: 'Inspector Sharma',
    station: 'Central Police Station, Ahmedabad',
    phone: '+91 9876543210',
    email: 'sharma@police.gov.in',
    avatar: '/images/avatars/officer-1.jpg'
  },
  caseNumber: 'AHM-2025-04-123',
  priority: 'medium',
  statusHistory: [
    {
      status: 'new',
      timestamp: '2025-03-30T14:30:00Z',
      description: 'Report submitted',
      updatedBy: 'System'
    },
    {
      status: 'in_review',
      timestamp: '2025-03-31T09:45:00Z',
      description: 'Report assigned to Central Police Station',
      updatedBy: 'Duty Officer'
    }
  ],
  evidence: [
    { id: 1, type: 'image', url: '/images/sample-evidence-1.jpg', name: 'Mall entrance.jpg' },
    { id: 2, type: 'image', url: '/images/sample-evidence-2.jpg', name: 'Food court.jpg' },
    { id: 3, type: 'document', url: '/docs/purchase-receipt.pdf', name: 'Phone receipt.pdf' }
  ],
  notes: [
    {
      id: 1,
      content: 'Thank you for submitting your report. We have assigned your case to Central Police Station.',
      createdAt: '2025-03-31T09:45:00Z',
      createdBy: { name: 'Duty Officer', role: 'admin' }
    },
    {
      id: 2,
      content: 'Can you provide the IMEI number of your phone? This will help us in tracking it.',
      createdAt: '2025-04-01T10:15:00Z',
      createdBy: { name: 'Inspector Sharma', role: 'admin' }
    }
  ]
};

// List of officers for assignment
const officers = [
  { id: 'OFF123456', name: 'Inspector Sharma', avatar: '/images/avatars/officer-1.jpg' },
  { id: 'OFF234567', name: 'Constable Patel', avatar: '/images/avatars/officer-2.jpg' },
  { id: 'OFF345678', name: 'Officer Singh', avatar: '/images/avatars/officer-3.jpg' },
  { id: 'OFF456789', name: 'Inspector Kumar', avatar: '/images/avatars/officer-4.jpg' }
];

export default function AdminReportDetail({ params }) {
  const [newNote, setNewNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(report.status);
  const [selectedOfficer, setSelectedOfficer] = useState(report.assignedTo?.id || '');
  const [selectedPriority, setSelectedPriority] = useState(report.priority);
  
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/a/dashboard' },
    { label: 'Reports', href: '/a/reports' },
    { label: report.id, href: `/a/reports/${report.id}` },
  ];
  
  const handleSubmitNote = () => {
    if (newNote.trim()) {
      // Here you would submit the note to your API
      console.log('Submitting note:', newNote);
      setNewNote('');
    }
  };
  
  const handleStatusUpdate = () => {
    // Here you would update the status in your API
    console.log('Updating status to:', selectedStatus);
    console.log('Assigned to officer ID:', selectedOfficer);
    console.log('Priority set to:', selectedPriority);
  };
  
  return (
    <div className="py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <Breadcrumb items={breadcrumbItems} className="mb-2" />
          <h1 className="text-2xl font-bold text-foreground">{report.title}</h1>
          <div className="flex items-center mt-1 space-x-2">
            <Badge variant={
              report.status === 'new' ? 'info' :
              report.status === 'in_review' ? 'warning' :
              report.status === 'assigned' ? 'info' :
              report.status === 'in_progress' ? 'warning' :
              report.status === 'resolved' ? 'success' :
              'error'
            }>
              {report.status.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            <span className="text-sm text-surface-500">
              {report.id} • {new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 001 1h12a1 1 0 001-1V7a1 1 0 00-1-1h-7a1 1 0 01-.707-.293l-2-2A1 1 0 004.586 3H3a1 1 0 00-1 1v13zm10-6a2 2 0 110-4 2 2 0 010 4zm-7 4a4 4 0 018 0v1H6v-1z" clipRule="evenodd" />
            </svg>
            Download Report
          </Button>
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Update Status
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-surface-700">{report.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-surface-500">Crime Type</h3>
                  <p className="text-foreground">{report.crimeType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-surface-500">Case Number</h3>
                  <p className="text-foreground">{report.caseNumber || 'Not assigned yet'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-surface-500">Reported On</h3>
                  <p className="text-foreground">{new Date(report.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-surface-500">Priority</h3>
                  <p className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      report.priority === 'high' ? 'bg-error-500' :
                      report.priority === 'medium' ? 'bg-warning-500' :
                      'bg-info-500'
                    }`}></span>
                    <span className="text-foreground">
                      {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <p className="text-surface-700 mb-3">{report.address}</p>
                <div className="h-64 w-full rounded-md overflow-hidden">
                  <Map 
                    center={[report.location.lat, report.location.lng]} 
                    markers={[{ position: [report.location.lat, report.location.lng] }]}
                    zoom={15}
                    height="100%"
                  />
                </div>
              </div>
              
              <div className="border-t border-surface-200 pt-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">Reported By</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Avatar src={report.reportedBy.avatar} name={report.reportedBy.name} size="lg" />
                  <div className="flex-1">
                    <h4 className="text-md font-medium">{report.reportedBy.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-sm text-surface-500">Email</p>
                        <p className="text-sm">{report.reportedBy.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-surface-500">Phone</p>
                        <p className="text-sm">{report.reportedBy.phone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-surface-500">Address</p>
                        <p className="text-sm">{report.reportedBy.address}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
              
              {report.assignedTo && (
                <div className="border-t border-surface-200 pt-6">
                  <h3 className="text-lg font-semibold mb-3">Assigned Officer</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Avatar src={report.assignedTo.avatar} name={report.assignedTo.name} size="lg" />
                    <div className="flex-1">
                      <h4 className="text-md font-medium">{report.assignedTo.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-sm text-surface-500">Station</p>
                          <p className="text-sm">{report.assignedTo.station}</p>
                        </div>
                        <div>
                          <p className="text-sm text-surface-500">Email</p>
                          <p className="text-sm">{report.assignedTo.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-surface-500">Phone</p>
                          <p className="text-sm">{report.assignedTo.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Evidence & Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <MediaGallery items={report.evidence} />
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 001 1h12a1 1 0 001-1V7a1 1 0 00-1-1h-7a1 1 0 01-.707-.293l-2-2A1 1 0 004.586 3H3a1 1 0 00-1 1v13zm10-6a2 2 0 110-4 2 2 0 010 4zm-7 4a4 4 0 018 0v1H6v-1z" clipRule="evenodd" />
                  </svg>
                  Upload New Evidence
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <NotesSection 
                notes={report.notes}
                onSubmit={handleSubmitNote}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Management</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusUpdater 
                currentStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                officers={officers}
                selectedOfficerId={selectedOfficer}
                onOfficerChange={setSelectedOfficer}
                currentPriority={selectedPriority}
                onPriorityChange={setSelectedPriority}
                onSubmit={handleStatusUpdate}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Case Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline items={report.statusHistory} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Generate FIR
              </Button>
              
              <Button variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Request More Information
              </Button>
              
              <Button variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Send Update to Citizen
              </Button>
              
              <Button variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share Case Details
              </Button>
              
              <div className="border-t border-surface-200 pt-3">
                <Button variant="destructive" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Mark as Dismissed
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
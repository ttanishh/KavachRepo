'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { StatusTimeline } from '@/components/u/StatusTimeline';
import { NotesSection } from '@/components/a/NotesSection';
import { MediaGallery } from '@/components/u/MediaGallery';
import { Map } from '@/components/common/Map';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Badge } from '@/components/common/Badge';

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
  assignedTo: {
    name: 'Inspector Sharma',
    station: 'Central Police Station, Ahmedabad',
    phone: '+91 9876543210',
    email: 'sharma@police.gov.in'
  },
  caseNumber: 'AHM-2025-04-123',
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

export default function ReportDetail() {
  const [newNote, setNewNote] = useState('');
  
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/u/dashboard' },
    { label: 'My Reports', href: '/u/reports' },
    { label: report.id, href: `/u/reports/${report.id}` },
  ];
  
  const handleSubmitNote = () => {
    if (newNote.trim()) {
      // Here you would submit the note to your API
      console.log('Submitting note:', newNote);
      setNewNote('');
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'var(--info-500)';
      case 'in_review': return 'var(--warning-500)';
      case 'assigned': return 'var(--info-500)';
      case 'in_progress': return 'var(--warning-500)';
      case 'resolved': return 'var(--success-500)';
      default: return 'var(--error-500)';
    }
  };
  
  return (
    <div className="py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <Breadcrumb items={breadcrumbItems} className="mb-2" />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{report.title}</h1>
          <div className="flex items-center mt-1 space-x-2">
            <Badge 
              style={{ 
                backgroundColor: `${getStatusColor(report.status)}20`,
                color: getStatusColor(report.status),
                padding: '0.25rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'bold'
              }}
            >
              {report.status.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            <span className="text-sm" style={{ color: 'var(--surface-500)' }}>
              {report.id} • {new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Report
          </Button>
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 001 1h12a1 1 0 001-1V7a1 1 0 00-1-1h-7a1 1 0 01-.707-.293l-2-2A1 1 0 004.586 3H3a1 1 0 00-1 1v13zm10-6a2 2 0 110-4 2 2 0 010 4zm-7 4a4 4 0 018 0v1H6v-1z" clipRule="evenodd" />
            </svg>
            Add Evidence
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Description</h3>
                <p style={{ color: 'var(--surface-700)' }}>{report.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium" style={{ color: 'var(--surface-500)' }}>Crime Type</h3>
                  <p style={{ color: 'var(--foreground)' }}>{report.crimeType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium" style={{ color: 'var(--surface-500)' }}>Case Number</h3>
                  <p style={{ color: 'var(--foreground)' }}>{report.caseNumber || 'Not assigned yet'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium" style={{ color: 'var(--surface-500)' }}>Reported On</h3>
                  <p style={{ color: 'var(--foreground)' }}>{new Date(report.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium" style={{ color: 'var(--surface-500)' }}>Last Updated</h3>
                  <p style={{ color: 'var(--foreground)' }}>{new Date(report.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Location</h3>
                <p className="mb-3" style={{ color: 'var(--surface-700)' }}>{report.address}</p>
                <div className="h-64 w-full rounded-md overflow-hidden">
                  <Map 
                    center={[report.location.lat, report.location.lng]} 
                    markers={[{ position: [report.location.lat, report.location.lng] }]}
                    zoom={15}
                    height="100%"
                  />
                </div>
              </div>
              
              {report.assignedTo && (
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Assigned Officer</h3>
                  <Card style={{ backgroundColor: 'var(--primary-50)', borderColor: 'var(--primary-100)' }}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium" style={{ color: 'var(--surface-500)' }}>Officer</h4>
                          <p style={{ color: 'var(--foreground)' }}>{report.assignedTo.name}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium" style={{ color: 'var(--surface-500)' }}>Station</h4>
                          <p style={{ color: 'var(--foreground)' }}>{report.assignedTo.station}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium" style={{ color: 'var(--surface-500)' }}>Phone</h4>
                          <p style={{ color: 'var(--foreground)' }}>{report.assignedTo.phone}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium" style={{ color: 'var(--surface-500)' }}>Email</h4>
                          <p style={{ color: 'var(--foreground)' }}>{report.assignedTo.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
              <CardTitle>Case Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline items={report.statusHistory} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm" style={{ color: 'var(--surface-600)' }}>
                If you need immediate assistance with this case:
              </p>
              
              <div className="p-3 rounded-md" style={{ backgroundColor: 'var(--primary-50)', borderColor: 'var(--primary-100)', borderWidth: '1px' }}>
                <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--surface-700)' }}>Contact Helpline</h4>
                <div className="text-base font-bold" style={{ color: 'var(--primary-700)' }}>1800-XXX-XXXX</div>
                <p className="text-xs mt-1" style={{ color: 'var(--surface-500)' }}>Available 24/7</p>
              </div>
              
              <Button className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Request Callback
              </Button>
              
              <div className="border-t pt-3" style={{ borderColor: 'var(--surface-200)' }}>
                <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--surface-600)' }}>Quick Options</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm flex items-center" style={{ color: 'var(--primary-600)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      </svg>
                      Download Report PDF
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm flex items-center" style={{ color: 'var(--primary-600)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Update Information
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm flex items-center" style={{ color: 'var(--primary-600)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                      </svg>
                      Live Chat Support
                    </Link>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" style={{ color: 'var(--surface-400)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Your information is secure</h3>
                    <p className="text-xs" style={{ color: 'var(--surface-500)' }}>End-to-end encryption applied</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
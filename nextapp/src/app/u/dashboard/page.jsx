'use client';

import Link from 'next/link';
import { ReportList } from '@/components/u/ReportList';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';

// Mock data
const recentReports = [
  {
    id: 'RPT123456',
    title: 'Mobile Phone Theft',
    description: 'My phone was stolen at City Mall on Saturday evening around 6 PM.',
    crimeType: 'Theft',
    status: 'in_review',
    createdAt: '2025-03-30T14:30:00Z',
    address: 'City Mall, Ahmedabad'
  },
  {
    id: 'RPT789012',
    title: 'Traffic Signal Not Working',
    description: 'The traffic signal at the intersection of MG Road and Station Road is not functioning for the past 2 days.',
    crimeType: 'Public Nuisance',
    status: 'new',
    createdAt: '2025-04-01T09:15:00Z',
    address: 'MG Road, Ahmedabad'
  }
];

// Mock statistics
const statistics = {
  totalReports: 5,
  inProgressReports: 2,
  resolvedReports: 3,
  responseTime: '24 hours'
};

export default function UserDashboard() {
  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Dashboard</h1>
        <Link href="/u/reports/new">
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Report New Case
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card style={{ backgroundColor: 'var(--primary-50)' }}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--surface-500)' }}>Total Reports</p>
                <h3 className="text-2xl font-bold mt-1" style={{ color: 'var(--foreground)' }}>{statistics.totalReports}</h3>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: 'var(--primary-500)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'var(--warning-500)', background: 'rgba(255, 192, 0, 0.1)' }}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--surface-500)' }}>In Progress</p>
                <h3 className="text-2xl font-bold mt-1" style={{ color: 'var(--foreground)' }}>{statistics.inProgressReports}</h3>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: 'var(--warning-500)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'var(--success-500)', background: 'rgba(0, 195, 101, 0.1)' }}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--surface-500)' }}>Resolved</p>
                <h3 className="text-2xl font-bold mt-1" style={{ color: 'var(--foreground)' }}>{statistics.resolvedReports}</h3>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: 'var(--success-500)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'var(--secondary-50)' }}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--surface-500)' }}>Avg. Response Time</p>
                <h3 className="text-2xl font-bold mt-1" style={{ color: 'var(--foreground)' }}>{statistics.responseTime}</h3>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: 'var(--secondary-500)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Reports</CardTitle>
                <Link href="/u/reports" className="text-sm" style={{ color: 'var(--primary-500)' }}>
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ReportList reports={recentReports} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Resources */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/u/reports/new">
                <Button variant="secondary" className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Report New Case
                </Button>
              </Link>
              <Link href="/u/emergency">
                <Button variant="outline" className="w-full justify-start" style={{ color: 'var(--error-500)', borderColor: 'var(--error-500)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Emergency Help
                </Button>
              </Link>
              <Link href="/u/profile">
                <Button variant="outline" className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Update Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Help & Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <Link href="/help/faq" className="flex items-center hover:text-blue-600" style={{ color: 'var(--surface-700)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" style={{ color: 'var(--surface-400)' }} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link href="/help/guide" className="flex items-center hover:text-blue-600" style={{ color: 'var(--surface-700)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" style={{ color: 'var(--surface-400)' }} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    User Guide
                  </Link>
                </li>
                <li>
                  <Link href="/help/contact" className="flex items-center hover:text-blue-600" style={{ color: 'var(--surface-700)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" style={{ color: 'var(--surface-400)' }} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="/help/emergency" className="flex items-center hover:text-blue-600" style={{ color: 'var(--surface-700)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" style={{ color: 'var(--surface-400)' }} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Emergency Contacts
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
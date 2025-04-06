'use client';

import Link from 'next/link';
import { ReportList } from '@/components/u/ReportList';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { formatDate } from '@/lib/utils';

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
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-surface-500 mt-1">Welcome back! Here's an overview of your reports</p>
        </div>
        <Link href="/u/reports/new">
          <Button className="shadow-md hover:shadow-lg transition-all bg-primary-500 hover:bg-primary-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Report New Case
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="border-l-4 border-primary-500 hover:shadow-lg transition-all bg-primary-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-surface-500">Total Reports</p>
                <h3 className="text-3xl font-bold mt-1 text-foreground">{statistics.totalReports}</h3>
              </div>
              <div className="p-3 rounded-full bg-primary-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-warning-500 hover:shadow-lg transition-all bg-warning-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-surface-500">In Progress</p>
                <h3 className="text-3xl font-bold mt-1 text-foreground">{statistics.inProgressReports}</h3>
              </div>
              <div className="p-3 rounded-full bg-warning-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-success-500 hover:shadow-lg transition-all bg-success-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-surface-500">Resolved</p>
                <h3 className="text-3xl font-bold mt-1 text-foreground">{statistics.resolvedReports}</h3>
              </div>
              <div className="p-3 rounded-full bg-success-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-secondary-500 hover:shadow-lg transition-all bg-secondary-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-surface-500">Avg. Response Time</p>
                <h3 className="text-3xl font-bold mt-1 text-foreground">{statistics.responseTime}</h3>
              </div>
              <div className="p-3 rounded-full bg-secondary-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reports */}
        <div className="lg:col-span-2">
          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader className="border-b border-surface-200 bg-surface-50 rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-primary-700">Recent Reports</CardTitle>
                <Link href="/u/reports" className="text-sm font-medium hover:underline text-primary-500 hover:text-primary-700 transition-colors">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <ReportList reports={recentReports} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Resources */}
        <div className="space-y-8">
          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader className="border-b border-surface-200 bg-surface-50 rounded-t-lg">
              <CardTitle className="text-xl text-primary-700">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <Link href="/u/reports/new">
                <Button variant="secondary" className="w-full justify-start hover:translate-x-1 transition-all bg-secondary-500 hover:bg-secondary-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Report New Case
                </Button>
              </Link>
              <Link href="/u/emergency">
                <Button variant="outline" className="w-full justify-start hover:translate-x-1 transition-all border-error-500 text-error-500 hover:bg-error-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Emergency Help
                </Button>
              </Link>
              <Link href="/u/profile">
                <Button variant="outline" className="w-full justify-start hover:translate-x-1 transition-all hover:bg-primary-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Update Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader className="border-b border-surface-200 bg-surface-50 rounded-t-lg">
              <CardTitle className="text-xl text-primary-700">Help & Resources</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <ul className="space-y-4">
                <li>
                  <Link href="/help/faq" className="flex items-center p-3 rounded-lg hover:bg-primary-50 transition-all text-surface-700 group">
                    <div className="bg-primary-100 p-2 rounded-full mr-3 group-hover:bg-primary-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium text-surface-800 group-hover:text-primary-700">Frequently Asked Questions</span>
                      <p className="text-sm text-surface-500 group-hover:text-primary-600">Get answers to common questions</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/help/guide" className="flex items-center p-3 rounded-lg hover:bg-secondary-50 transition-all text-surface-700 group">
                    <div className="bg-secondary-100 p-2 rounded-full mr-3 group-hover:bg-secondary-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium text-surface-800 group-hover:text-secondary-700">User Guide</span>
                      <p className="text-sm text-surface-500 group-hover:text-secondary-600">Learn how to use the platform</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/help/contact" className="flex items-center p-3 rounded-lg hover:bg-success-50 transition-all text-surface-700 group">
                    <div className="bg-success-100 p-2 rounded-full mr-3 group-hover:bg-success-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium text-surface-800 group-hover:text-success-700">Contact Support</span>
                      <p className="text-sm text-surface-500 group-hover:text-success-600">Get help from our team</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/help/emergency" className="flex items-center p-3 rounded-lg hover:bg-error-50 transition-all text-surface-700 group">
                    <div className="bg-error-100 p-2 rounded-full mr-3 group-hover:bg-error-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium text-surface-800 group-hover:text-error-700">Emergency Contacts</span>
                      <p className="text-sm text-surface-500 group-hover:text-error-600">Important numbers and resources</p>
                    </div>
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
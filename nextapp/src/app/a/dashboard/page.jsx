import Link from 'next/link';
import { AssignedReportsTable } from '@/components/a/AssignedReportsTable';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { StationMap } from '@/components/a/StationMap';
import { AnalyticsChart } from '@/components/a/AnalyticsChart';
import { FilterBar } from '@/components/a/FilterBar';

// Mock data
const dashboardStats = {
  totalReports: 124,
  pendingReports: 18,
  resolvedReports: 106,
  officersOnDuty: 12
};

const recentReports = [
  {
    id: 'RPT123456',
    title: 'Mobile Phone Theft',
    reportedBy: {
      name: 'Rahul Kumar',
      phone: '+91 9876543210'
    },
    crimeType: 'Theft',
    location: 'City Mall, Ahmedabad',
    status: 'in_review',
    priority: 'medium',
    createdAt: '2025-03-30T14:30:00Z',
    assignedTo: 'Officer Patel'
  },
  {
    id: 'RPT789012',
    title: 'Traffic Signal Not Working',
    reportedBy: {
      name: 'Priya Desai',
      phone: '+91 9876543211'
    },
    crimeType: 'Public Nuisance',
    location: 'MG Road, Ahmedabad',
    status: 'new',
    priority: 'low',
    createdAt: '2025-04-01T09:15:00Z',
    assignedTo: null
  },
  {
    id: 'RPT345678',
    title: 'Robbery at Convenience Store',
    reportedBy: {
      name: 'Anand Shah',
      phone: '+91 9876543212'
    },
    crimeType: 'Robbery',
    location: 'Sector 7, Gandhinagar',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2025-03-29T20:45:00Z',
    assignedTo: 'Inspector Sharma'
  },
  {
    id: 'RPT901234',
    title: 'Vehicle Vandalism',
    reportedBy: {
      name: 'Vikram Patel',
      phone: '+91 9876543213'
    },
    crimeType: 'Vandalism',
    location: 'Satellite Area, Ahmedabad',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2025-03-28T15:20:00Z',
    assignedTo: 'Officer Singh'
  }
];

const crimeHotspots = [
  { lat: 23.0225, lng: 72.5714, intensity: 8 },
  { lat: 23.0350, lng: 72.5517, intensity: 5 },
  { lat: 23.0128, lng: 72.5943, intensity: 3 },
  { lat: 23.0469, lng: 72.5316, intensity: 6 }
];

const availableOfficers = [
  { id: 1, name: 'Officer Kumar', status: 'on_duty', location: { lat: 23.0225, lng: 72.5714 } },
  { id: 2, name: 'Officer Patel', status: 'on_duty', location: { lat: 23.0350, lng: 72.5517 } },
  { id: 3, name: 'Inspector Sharma', status: 'on_case', location: { lat: 23.0128, lng: 72.5943 } },
  { id: 4, name: 'Officer Singh', status: 'off_duty', location: null }
];

const analyticsData = {
  crimeByType: [
    { name: 'Theft', value: 42 },
    { name: 'Public Nuisance', value: 28 },
    { name: 'Robbery', value: 15 },
    { name: 'Vandalism', value: 18 },
    { name: 'Assault', value: 10 },
    { name: 'Cybercrime', value: 11 }
  ],
  resolutionTimeByType: [
    { name: 'Theft', value: 5.2 },
    { name: 'Public Nuisance', value: 2.3 },
    { name: 'Robbery', value: 7.8 },
    { name: 'Vandalism', value: 3.1 },
    { name: 'Assault', value: 6.5 },
    { name: 'Cybercrime', value: 8.2 }
  ],
  reportsOverTime: [
    { date: '2025-03-01', reports: 8 },
    { date: '2025-03-08', reports: 12 },
    { date: '2025-03-15', reports: 10 },
    { date: '2025-03-22', reports: 15 },
    { date: '2025-03-29', reports: 18 }
  ]
};

export default function AdminDashboard() {
  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Station Dashboard</h1>
        <div className="flex space-x-2">
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            View Live Map
          </Button>
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
            </svg>
            Generate Report
          </Button>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-[var(--primary-50)] border border-[var(--primary-100)]">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[var(--surface-500)]">Total Reports</p>
                <h3 className="text-2xl font-bold mt-1 text-[var(--foreground)]">{dashboardStats.totalReports}</h3>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--primary-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-sm text-[var(--surface-600)]">
              <span className="text-[var(--primary-600)] font-medium">↑ 8%</span> compared to last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--warning-500)] bg-opacity-10 border border-[var(--warning-500)] border-opacity-20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[var(--surface-500)]">Pending Cases</p>
                <h3 className="text-2xl font-bold mt-1 text-[var(--foreground)]">{dashboardStats.pendingReports}</h3>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--warning-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-sm text-[var(--surface-600)]">
              <span className="text-[var(--success-500)] font-medium">↓ 12%</span> compared to last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--success-500)] bg-opacity-10 border border-[var(--success-500)] border-opacity-20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[var(--surface-500)]">Resolved Cases</p>
                <h3 className="text-2xl font-bold mt-1 text-[var(--foreground)]">{dashboardStats.resolvedReports}</h3>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--success-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-sm text-[var(--surface-600)]">
              <span className="text-[var(--success-500)] font-medium">↑ 15%</span> compared to last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--secondary-50)] border border-[var(--secondary-100)]">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[var(--surface-500)]">Officers On Duty</p>
                <h3 className="text-2xl font-bold mt-1 text-[var(--foreground)]">{dashboardStats.officersOnDuty}</h3>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--secondary-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-sm text-[var(--surface-600)]">
              <span className="text-[var(--error-500)] font-medium">↓ 2</span> officers from yesterday
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <CardTitle>Case Management</CardTitle>
              <div>
                <FilterBar />
              </div>
            </CardHeader>
            <CardContent>
              <AssignedReportsTable 
                reports={recentReports} 
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Live Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <StationMap 
                  center={[23.0225, 72.5714]} 
                  hotspots={crimeHotspots}
                  officers={availableOfficers}
                  zoom={13}
                />
              </div>
              <div className="mt-4 border-t border-[var(--surface-200)] pt-4">
                <h3 className="text-sm font-medium text-[var(--surface-700)] mb-2">Available Officers</h3>
                <div className="space-y-2">
                  {availableOfficers.map(officer => (
                    <div key={officer.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${
                          officer.status === 'on_duty' ? 'bg-[var(--success-500)]' : 
                          officer.status === 'on_case' ? 'bg-[var(--warning-500)]' : 
                          'bg-[var(--surface-400)]'
                        }`}></div>
                        <span className="text-sm text-[var(--surface-700)]">{officer.name}</span>
                      </div>
                      <span className="text-xs text-[var(--surface-500)] capitalize">
                        {officer.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  View All Officers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cases by Crime Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <AnalyticsChart 
                data={analyticsData.crimeByType} 
                type="pie"
                xKey="name"
                yKey="value"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resolution Time by Type (days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <AnalyticsChart 
                data={analyticsData.resolutionTimeByType} 
                type="bar"
                xKey="name"
                yKey="value"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reports Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <AnalyticsChart 
                data={analyticsData.reportsOverTime} 
                type="line"
                xKey="date"
                yKey="reports"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
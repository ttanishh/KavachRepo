'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/Tabs';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { OfficersList } from '@/components/sa/OfficersList';
import { StationPerformanceChart } from '@/components/sa/StationPerformanceChart';
import { StationMap } from '@/components/sa/StationMap';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

// Mock data for a specific station
const station = {
  id: 5,
  name: 'Central Police Station',
  state: 'Gujarat',
  city: 'Ahmedabad',
  address: '56 River Front, Navrangpura, Ahmedabad',
  status: 'active',
  coordinates: { lat: 23.0225, lng: 72.5714 },
  contactInfo: {
    phone: '+91 79 2658 3924',
    email: 'central.ahmedabad@police.gujarat.gov.in',
    website: 'https://police.gujarat.gov.in/ahmedabad/central',
    emergencyNumber: '100'
  },
  jurisdiction: 'Navrangpura, Ambawadi, Ellis Bridge, Paldi, Stadium',
  coverage: {
    population: 385000,
    areaKm2: 32.5
  },
  statsOverview: {
    totalReports: 798,
    pendingReports: 127,
    resolvedReports: 671,
    activeOfficers: 33,
    responseTime: 37, // minutes
    clearanceRate: 84, // percentage
  },
  performance: {
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      reports: [45, 52, 61, 67, 59, 78, 65, 72, 84, 78, 63, 74],
      responseTime: [42, 40, 38, 37, 39, 36, 38, 36, 35, 37, 38, 37],
      clearanceRate: [78, 79, 81, 80, 82, 85, 83, 84, 87, 86, 82, 84]
    },
    crimeSplit: {
      labels: ['Theft', 'Traffic Violation', 'Cybercrime', 'Assault', 'Vandalism', 'Others'],
      data: [32, 24, 15, 12, 10, 7]
    }
  },
  equipment: {
    vehicles: 8,
    computers: 12,
    bodyCameras: 18,
    otherEquipment: 35
  },
  topOfficers: [
    { id: 1, name: 'Inspector Patel', rank: 'Inspector', assignedCases: 24, resolvedCases: 21, avatar: '/images/avatars/officer-1.jpg' },
    { id: 2, name: 'Constable Singh', rank: 'Senior Constable', assignedCases: 18, resolvedCases: 16, avatar: '/images/avatars/officer-2.jpg' },
    { id: 3, name: 'Officer Kumar', rank: 'Sub-Inspector', assignedCases: 22, resolvedCases: 19, avatar: '/images/avatars/officer-3.jpg' }
  ],
  recentActivity: [
    { type: 'report', description: 'New theft report assigned', timestamp: '2025-04-04T14:32:20Z' },
    { type: 'officer', description: 'Officer Mehta completed training', timestamp: '2025-04-03T09:15:43Z' },
    { type: 'system', description: 'Station data backed up', timestamp: '2025-04-02T02:05:11Z' },
    { type: 'report', description: 'Case #RT78942 closed successfully', timestamp: '2025-04-01T16:23:45Z' }
  ],
  resources: {
    budget: {
      allocated: 1850000, // INR
      spent: 1205000, // INR
      remaining: 645000 // INR
    },
    manpower: {
      authorized: 45,
      current: 33,
      onLeave: 2,
      trainees: 5
    }
  }
};

// Breadcrumb items
const breadcrumbItems = [
  { label: 'Dashboard', href: '/sa/dashboard' },
  { label: 'Stations', href: '/sa/stations' },
  { label: station.name, href: `/sa/stations/${station.id}` },
];

export default function StationDetail({ params }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleDeactivateStation = () => {
    // API call would go here
    console.log('Deactivating station:', station.id);
    setShowDeactivateDialog(false);
  };
  
  const handleDeleteStation = () => {
    // API call would go here
    console.log('Deleting station:', station.id);
    setShowDeleteDialog(false);
  };
  
  return (
    <div className="py-6">
      <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <Breadcrumb items={breadcrumbItems} className="mb-2" />
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{station.name}</h1>
            <Badge variant={
              station.status === 'active' ? 'success' :
              station.status === 'maintenance' ? 'warning' :
              'error'
            }>
              {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
            </Badge>
          </div>
          <p className="text-surface-500 mt-1">{station.address}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href={`/sa/stations/${station.id}/edit`}>
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Station
            </Button>
          </Link>
          <div className="relative">
            <Button variant="outline" className="text-error-500 border-error-500 hover:bg-error-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Actions
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-surface-200">
              <div className="py-1">
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-surface-700 hover:bg-surface-50"
                  onClick={() => setShowDeactivateDialog(true)}
                >
                  Deactivate Station
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-error-500 hover:bg-surface-50"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Delete Station
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="officers">Officers</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-surface-500">Phone</h3>
                    <p className="text-foreground">{station.contactInfo.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-surface-500">Email</h3>
                    <p className="text-foreground">{station.contactInfo.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-surface-500">Emergency Number</h3>
                    <p className="text-foreground font-bold">{station.contactInfo.emergencyNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-surface-500">Website</h3>
                    <a href={station.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      Official Website
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Location & Jurisdiction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[150px] mb-4">
                  <StationMap 
                    center={[station.coordinates.lat, station.coordinates.lng]} 
                    zoom={13}
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-surface-500">Jurisdiction Areas</h3>
                    <p className="text-foreground">{station.jurisdiction}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-surface-500">Population</h3>
                      <p className="text-foreground">{station.coverage.population.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-surface-500">Area</h3>
                      <p className="text-foreground">{station.coverage.areaKm2} km²</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Key Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-surface-50 rounded-lg">
                    <h3 className="text-sm font-medium text-surface-500">Total Reports</h3>
                    <p className="text-xl font-bold text-foreground">{station.statsOverview.totalReports}</p>
                  </div>
                  <div className="p-3 bg-warning-500 bg-opacity-10 rounded-lg">
                    <h3 className="text-sm font-medium text-surface-500">Pending</h3>
                    <p className="text-xl font-bold text-foreground">{station.statsOverview.pendingReports}</p>
                  </div>
                  <div className="p-3 bg-success-500 bg-opacity-10 rounded-lg">
                    <h3 className="text-sm font-medium text-surface-500">Clearance Rate</h3>
                    <p className="text-xl font-bold text-foreground">{station.statsOverview.clearanceRate}%</p>
                  </div>
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <h3 className="text-sm font-medium text-surface-500">Response Time</h3>
                    <p className="text-xl font-bold text-foreground">{station.statsOverview.responseTime} min</p>
                  </div>
                  <div className="p-3 bg-secondary-50 rounded-lg">
                    <h3 className="text-sm font-medium text-surface-500">Officers</h3>
                    <p className="text-xl font-bold text-foreground">{station.statsOverview.activeOfficers}</p>
                  </div>
                  <div className="p-3 bg-accent-50 rounded-lg">
                    <h3 className="text-sm font-medium text-surface-500">Equipment</h3>
                    <p className="text-xl font-bold text-foreground">{station.equipment.vehicles + station.equipment.computers + station.equipment.bodyCameras}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Crime Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <StationPerformanceChart
                      type="doughnut"
                      labels={station.performance.crimeSplit.labels}
                      data={station.performance.crimeSplit.data}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Officers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {station.topOfficers.map((officer, index) => (
                    <div key={officer.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface-50">
                      <div className="h-10 w-10 rounded-full bg-surface-200 overflow-hidden">
                        {officer.avatar ? (
                          <img src={officer.avatar} alt={officer.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-surface-500">
                            {officer.name.substring(0, 1)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{officer.name}</h3>
                        <p className="text-sm text-surface-500">{officer.rank}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span className="text-success-500">{officer.resolvedCases} resolved</span>
                          <span className="text-surface-400">|</span>
                          <span className="text-warning-500">{officer.assignedCases - officer.resolvedCases} pending</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Link
                    href={`/sa/stations/${station.id}/officers`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center"
                  >
                    View All Officers
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <StationPerformanceChart
                    type="line"
                    labels={station.performance.monthly.labels}
                    dataSets={[
                      {
                        label: 'Reports',
                        data: station.performance.monthly.reports,
                        borderColor: 'var(--color-primary-500)'
                      },
                      {
                        label: 'Response Time (min)',
                        data: station.performance.monthly.responseTime,
                        borderColor: 'var(--color-warning-500)'
                      },
                      {
                        label: 'Clearance Rate (%)',
                        data: station.performance.monthly.clearanceRate,
                        borderColor: 'var(--color-success-500)'
                      }
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Additional performance metrics would go here */}
          </div>
        </TabsContent>
        
        <TabsContent value="officers" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Station Officers</CardTitle>
              <Button>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Officer
              </Button>
            </CardHeader>
            <CardContent>
              <OfficersList stationId={station.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-surface-600">Total Budget</span>
                      <span className="text-sm font-medium text-surface-600">
                        ₹{station.resources.budget.allocated.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-surface-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full" 
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-surface-600">Spent</span>
                      <span className="text-sm font-medium text-surface-600">
                        ₹{station.resources.budget.spent.toLocaleString()} 
                        ({Math.round(station.resources.budget.spent / station.resources.budget.allocated * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-surface-200 rounded-full h-2">
                      <div 
                        className="bg-warning-500 h-2 rounded-full" 
                        style={{ width: `${Math.round(station.resources.budget.spent / station.resources.budget.allocated * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-surface-600">Remaining</span>
                      <span className="text-sm font-medium text-surface-600">
                        ₹{station.resources.budget.remaining.toLocaleString()}
                        ({Math.round(station.resources.budget.remaining / station.resources.budget.allocated * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-surface-200 rounded-full h-2">
                      <div 
                        className="bg-success-500 h-2 rounded-full" 
                        style={{ width: `${Math.round(station.resources.budget.remaining / station.resources.budget.allocated * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-surface-50 rounded-lg">
                  <h3 className="font-medium text-foreground mb-3">Budget Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-surface-600">Personnel</span>
                      <span className="text-sm text-surface-600">₹{(station.resources.budget.spent * 0.65).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-surface-600">Equipment</span>
                      <span className="text-sm text-surface-600">₹{(station.resources.budget.spent * 0.15).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-surface-600">Operations</span>
                      <span className="text-sm text-surface-600">₹{(station.resources.budget.spent * 0.12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-surface-600">Training</span>
                      <span className="text-sm text-surface-600">₹{(station.resources.budget.spent * 0.08).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Staff & Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Manpower</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-surface-600">Current vs. Authorized</span>
                          <span className="text-sm font-medium text-surface-600">
                            {station.resources.manpower.current}/{station.resources.manpower.authorized}
                          </span>
                        </div>
                        <div className="w-full bg-surface-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${station.resources.manpower.current / station.resources.manpower.authorized < 0.8 ? 'bg-warning-500' : 'bg-success-500'}`}
                            style={{ width: `${Math.round(station.resources.manpower.current / station.resources.manpower.authorized * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-surface-50 rounded-lg">
                          <h4 className="text-sm text-surface-500">On Leave</h4>
                          <p className="text-foreground font-medium">{station.resources.manpower.onLeave}</p>
                        </div>
                        <div className="p-3 bg-surface-50 rounded-lg">
                          <h4 className="text-sm text-surface-500">Trainees</h4>
                          <p className="text-foreground font-medium">{station.resources.manpower.trainees}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Equipment</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-surface-50 rounded-lg">
                        <h4 className="text-sm text-surface-500">Vehicles</h4>
                        <p className="text-foreground font-medium">{station.equipment.vehicles}</p>
                      </div>
                      <div className="p-3 bg-surface-50 rounded-lg">
                        <h4 className="text-sm text-surface-500">Computers</h4>
                        <p className="text-foreground font-medium">{station.equipment.computers}</p>
                      </div>
                      <div className="p-3 bg-surface-50 rounded-lg">
                        <h4 className="text-sm text-surface-500">Body Cameras</h4>
                        <p className="text-foreground font-medium">{station.equipment.bodyCameras}</p>
                      </div>
                      <div className="p-3 bg-surface-50 rounded-lg">
                        <h4 className="text-sm text-surface-500">Other Equipment</h4>
                        <p className="text-foreground font-medium">{station.equipment.otherEquipment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Station Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-surface-500 mb-4">Configure station-specific settings, access controls, and system integrations.</p>
              <div className="space-y-6">
                {/* Settings sections would go here */}
                <div className="p-4 border border-warning-500 border-dashed rounded-lg">
                  <p className="text-warning-500">Settings implementation is in progress. Please check back later.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Deactivate Confirmation Dialog */}
      <ConfirmDialog
        open={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
        title="Deactivate Police Station"
        description="Are you sure you want to deactivate this police station? This will temporarily remove it from active duty."
        confirmText="Deactivate"
        confirmVariant="warning"
        onConfirm={handleDeactivateStation}
      />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Police Station"
        description="Are you sure you want to permanently delete this police station? This action cannot be undone and will remove all associated data."
        confirmText="Delete"
        confirmVariant="destructive"
        onConfirm={handleDeleteStation}
      />
    </div>
  );
}
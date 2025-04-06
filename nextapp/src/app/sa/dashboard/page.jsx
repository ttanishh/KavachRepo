'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Select } from '@/components/common/Select';
import { Badge } from '@/components/common/Badge';
import { AnalyticsChart } from '@/components/a/AnalyticsChart';
import { StateMap } from '@/components/sa/StateMap';
import { StatsGrid } from '@/components/sa/StatsGrid';

// Mock data
const globalStats = {
  totalReports: 24865,
  activeReports: 3752,
  resolvedReports: 21113,
  totalUsers: 98432,
  totalOfficers: 1485,
  totalStations: 86,
  responseTimeAvg: 42, // minutes
  clearanceRate: 78, // percentage
  systemUptime: 99.98 // percentage
};

// Top stations by performance
const topStations = [
  { id: 1, name: 'Central Police Station, Mumbai', reports: 1245, clearanceRate: 92, responseTime: 28 },
  { id: 2, name: 'Koramangala Police Station, Bangalore', reports: 986, clearanceRate: 89, responseTime: 32 },
  { id: 3, name: 'MG Road Police Station, Delhi', reports: 1122, clearanceRate: 86, responseTime: 35 },
  { id: 4, name: 'Banjara Hills Police Station, Hyderabad', reports: 876, clearanceRate: 85, responseTime: 36 },
  { id: 5, name: 'Central Police Station, Ahmedabad', reports: 798, clearanceRate: 84, responseTime: 37 }
];

// Recent system alerts
const systemAlerts = [
  { id: 1, type: 'security', message: 'Multiple failed login attempts detected from IP 103.54.32.12', timestamp: '2025-04-04T14:32:20Z', severity: 'high' },
  { id: 2, type: 'performance', message: 'Database query latency increased by 25% in Mumbai region', timestamp: '2025-04-03T08:15:43Z', severity: 'medium' },
  { id: 3, type: 'system', message: 'Scheduled maintenance completed successfully', timestamp: '2025-04-01T02:05:11Z', severity: 'low' },
  { id: 4, type: 'security', message: 'New administrator account created for Gujarat State Police', timestamp: '2025-03-29T11:23:45Z', severity: 'medium' }
];

// Analytics data for charts
const analyticsData = {
  reportsTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [1845, 1728, 2042, 2367, 2189, 2511, 2340, 2795, 2680, 2450, 2320, 2598]
  },
  reportsByState: {
    labels: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Telangana', 'Others'],
    data: [5230, 4120, 3850, 3210, 2980, 2650, 2825]
  },
  crimeDistribution: {
    labels: ['Theft', 'Cybercrime', 'Traffic', 'Assault', 'Burglary', 'Others'],
    data: [28, 22, 18, 12, 10, 10]
  }
};

// State locations for map
const stateLocations = [
  { 
    id: 1, 
    name: 'Maharashtra', 
    center: [19.7515, 75.7139], 
    stats: { reports: 5230, stations: 18, avgResponse: 38 },
    color: '#0070F3'
  },
  { 
    id: 2, 
    name: 'Delhi', 
    center: [28.7041, 77.1025], 
    stats: { reports: 4120, stations: 12, avgResponse: 32 },
    color: '#5096F7'
  },
  { 
    id: 3, 
    name: 'Karnataka', 
    center: [15.3173, 75.7139], 
    stats: { reports: 3850, stations: 14, avgResponse: 36 },
    color: '#79B7F9'
  },
  { 
    id: 4, 
    name: 'Tamil Nadu', 
    center: [11.1271, 78.6569], 
    stats: { reports: 3210, stations: 12, avgResponse: 40 },
    color: '#A1CCFB'
  },
  { 
    id: 5, 
    name: 'Gujarat', 
    center: [22.2587, 71.1924], 
    stats: { reports: 2980, stations: 10, avgResponse: 37 },
    color: '#C8E1FD'
  },
  { 
    id: 6, 
    name: 'Telangana', 
    center: [18.1124, 79.0193], 
    stats: { reports: 2650, stations: 8, avgResponse: 42 },
    color: '#E6F0FE'
  }
];

// Time period options
const timePeriods = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' }
];

export default function SuperAdminDashboard() {
  const [timePeriod, setTimePeriod] = useState('month');
  const [selectedState, setSelectedState] = useState(null);
  
  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
  };
  
  const handleStateSelect = (stateId) => {
    const state = stateLocations.find(s => s.id === stateId);
    setSelectedState(state);
  };
  
  const handleClearStateSelection = () => {
    setSelectedState(null);
  };
  
  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SuperAdmin Dashboard</h1>
          <p className="text-surface-500 mt-1">
            System-wide overview and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            name="timePeriod"
            value={timePeriod}
            onChange={handleTimePeriodChange}
            options={timePeriods}
            className="w-40"
          />
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 001 1h12a1 1 0 001-1V7a1 1 0 00-1-1h-7a1 1 0 01-.707-.293l-2-2A1 1 0 004.586 3H3a1 1 0 00-1 1v13zm10-6a2 2 0 110-4 2 2 0 010 4zm-7 4a4 4 0 018 0v1H6v-1z" clipRule="evenodd" />
            </svg>
            Generate Report
          </Button>
        </div>
      </div>
      
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-surface-500">Total Reports</p>
                <h3 className="text-2xl font-bold mt-1">{globalStats.totalReports.toLocaleString()}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-success-500 font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    8.3% from last period
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-white bg-opacity-70 rounded-md p-2">
                <span className="text-xs text-surface-500">Active</span>
                <p className="text-foreground font-medium">{globalStats.activeReports.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-70 rounded-md p-2">
                <span className="text-xs text-surface-500">Resolved</span>
                <p className="text-foreground font-medium">{globalStats.resolvedReports.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-surface-500">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">{globalStats.totalUsers.toLocaleString()}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-success-500 font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    12.5% from last period
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-white bg-opacity-70 rounded-md p-2">
                <span className="text-xs text-surface-500">Citizens</span>
                <p className="text-foreground font-medium">{(globalStats.totalUsers - globalStats.totalOfficers).toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-70 rounded-md p-2">
                <span className="text-xs text-surface-500">Officers</span>
                <p className="text-foreground font-medium">{globalStats.totalOfficers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-surface-500">System Performance</p>
                <h3 className="text-2xl font-bold mt-1">{globalStats.systemUptime}%</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-success-500 font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    0.2% from last period
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-white bg-opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-white bg-opacity-70 rounded-md p-2">
                <span className="text-xs text-surface-500">Avg. Response</span>
                <p className="text-foreground font-medium">{globalStats.responseTimeAvg} min</p>
              </div>
              <div className="bg-white bg-opacity-70 rounded-md p-2">
                <span className="text-xs text-surface-500">Clearance Rate</span>
                <p className="text-foreground font-medium">{globalStats.clearanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional performance metrics in small cards */}
      <StatsGrid className="mb-8" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* National Map with State Data */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>National Overview</CardTitle>
              {selectedState && (
                <Button variant="ghost" size="sm" onClick={handleClearStateSelection}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Clear Selection
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <StateMap 
                  states={stateLocations}
                  selectedState={selectedState?.id}
                  onSelectState={handleStateSelect}
                />
              </div>
              
              {selectedState && (
                <div className="mt-4 p-4 bg-surface-50 rounded-lg">
                  <h3 className="text-lg font-medium text-foreground mb-2">{selectedState.name} Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-surface-500">Total Reports</p>
                      <p className="text-lg font-medium">{selectedState.stats.reports.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Police Stations</p>
                      <p className="text-lg font-medium">{selectedState.stats.stations}</p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Avg. Response Time</p>
                      <p className="text-lg font-medium">{selectedState.stats.avgResponse} min</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link 
                      href={`/sa/states/${selectedState.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center"
                    >
                      View Complete Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Top Performing Stations */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top Performing Stations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topStations.map((station, index) => (
                  <div 
                    key={station.id} 
                    className={`p-3 rounded-lg ${index === 0 ? 'bg-primary-50 border border-primary-100' : 'bg-surface-50'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{station.name}</h3>
                        <p className="text-sm text-surface-500 mt-1">
                          {station.reports} reports • {station.clearanceRate}% clearance
                        </p>
                      </div>
                      <div className={`text-sm font-medium ${
                        station.responseTime < 30 ? 'text-success-500' : 
                        station.responseTime < 40 ? 'text-warning-500' : 
                        'text-error-500'
                      }`}>
                        {station.responseTime} min
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-surface-200 rounded-full h-1.5">
                        <div 
                          className="bg-primary-500 h-1.5 rounded-full" 
                          style={{ width: `${station.clearanceRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-surface-200">
                <Link 
                  href="/sa/stations"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center"
                >
                  View All Stations
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Report Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <AnalyticsChart
                type="line"
                labels={analyticsData.reportsTrend.labels}
                data={analyticsData.reportsTrend.data}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reports by State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <AnalyticsChart
                type="bar"
                labels={analyticsData.reportsByState.labels}
                data={analyticsData.reportsByState.data}
                horizontal={true}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Crime Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <AnalyticsChart
                type="doughnut"
                labels={analyticsData.crimeDistribution.labels}
                data={analyticsData.crimeDistribution.data}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* System Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>System Alerts</CardTitle>
          <Link 
            href="/sa/alerts"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemAlerts.map(alert => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-surface-50">
                <div className={`p-2 rounded-full ${
                  alert.severity === 'high' ? 'bg-error-500 bg-opacity-10' : 
                  alert.severity === 'medium' ? 'bg-warning-500 bg-opacity-10' : 
                  'bg-info-500 bg-opacity-10'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                    alert.severity === 'high' ? 'text-error-500' : 
                    alert.severity === 'medium' ? 'text-warning-500' : 
                    'text-info-500'
                  }`} viewBox="0 0 20 20" fill="currentColor">
                    {alert.type === 'security' ? (
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : alert.type === 'performance' ? (
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                    )}
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{alert.message}</p>
                    <Badge variant={
                      alert.severity === 'high' ? 'error' : 
                      alert.severity === 'medium' ? 'warning' : 
                      'info'
                    }>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-surface-500 mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { AnalyticsChart } from '@/components/a/AnalyticsChart';
import { HeatMap } from '@/components/a/HeatMap';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/Tabs';

// Mock analytics data
const analyticsData = {
  reportsByType: {
    labels: ['Theft', 'Cybercrime', 'Traffic', 'Assault', 'Burglary', 'Others'],
    data: [35, 22, 18, 15, 12, 22],
    colors: ['#0070F3', '#5096F7', '#79B7F9', '#A1CCFB', '#C8E1FD', '#E6F0FE']
  },
  reportsByStatus: {
    labels: ['New', 'In Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
    data: [12, 18, 24, 30, 45, 15]
  },
  reportsByLocation: {
    labels: ['North', 'South', 'East', 'West', 'Central'],
    data: [28, 35, 42, 19, 31]
  },
  monthlyTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [42, 38, 55, 68, 72, 80, 76, 82, 65, 58, 63, 77]
  },
  weekdayDistribution: {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    data: [22, 38, 42, 35, 40, 58, 63]
  },
  hourlyDistribution: {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    data: [5, 3, 2, 1, 0, 2, 5, 10, 15, 20, 25, 30, 28, 25, 22, 18, 23, 28, 30, 25, 20, 15, 10, 8]
  },
  responseTimeAvg: {
    labels: ['Theft', 'Cybercrime', 'Traffic', 'Assault', 'Burglary', 'Others'],
    data: [45, 72, 36, 24, 38, 50] // in minutes
  },
  clearanceRate: {
    labels: ['Theft', 'Cybercrime', 'Traffic', 'Assault', 'Burglary', 'Others'],
    data: [65, 48, 82, 75, 70, 58] // in percentage
  }
};

// Heatmap data
const heatmapData = {
  center: [23.0225, 72.5714], // Ahmedabad coordinates
  data: [
    { lat: 23.0225, lng: 72.5714, weight: 0.9 }, // City Center
    { lat: 23.0350, lng: 72.5400, weight: 0.7 },
    { lat: 23.0450, lng: 72.5650, weight: 0.8 },
    { lat: 23.0150, lng: 72.5800, weight: 0.6 },
    { lat: 23.0300, lng: 72.5500, weight: 0.5 },
    { lat: 23.0500, lng: 72.5850, weight: 0.4 },
    { lat: 23.0100, lng: 72.5600, weight: 0.3 },
    { lat: 23.0350, lng: 72.5900, weight: 0.7 },
    { lat: 23.0475, lng: 72.5350, weight: 0.8 },
    { lat: 23.0225, lng: 72.5500, weight: 0.9 },
    { lat: 23.0300, lng: 72.5850, weight: 0.6 },
    // Add more data points as needed
  ]
};

// Time period options
const timePeriods = [
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'last3months', label: 'Last 3 Months' },
  { value: 'last6months', label: 'Last 6 Months' },
  { value: 'lastyear', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' }
];

// Crime type options
const crimeTypes = [
  { value: 'all', label: 'All Crime Types' },
  { value: 'theft', label: 'Theft' },
  { value: 'cybercrime', label: 'Cybercrime' },
  { value: 'traffic', label: 'Traffic' },
  { value: 'assault', label: 'Assault' },
  { value: 'burglary', label: 'Burglary' },
  { value: 'others', label: 'Others' }
];

export default function Analytics() {
  const [timePeriod, setTimePeriod] = useState('last30days');
  const [crimeType, setCrimeType] = useState('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  
  const handleTimePeriodChange = (e) => {
    const value = e.target.value;
    setTimePeriod(value);
    setShowDatePicker(value === 'custom');
  };
  
  const handleCrimeTypeChange = (e) => {
    setCrimeType(e.target.value);
  };
  
  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };
  
  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Select
            name="timePeriod"
            value={timePeriod}
            onChange={handleTimePeriodChange}
            options={timePeriods}
            className="w-full sm:w-40"
          />
          <Select
            name="crimeType"
            value={crimeType}
            onChange={handleCrimeTypeChange}
            options={crimeTypes}
            className="w-full sm:w-48"
          />
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 001 1h12a1 1 0 001-1V7a1 1 0 00-1-1h-7a1 1 0 01-.707-.293l-2-2A1 1 0 004.586 3H3a1 1 0 00-1 1v13zm10-6a2 2 0 110-4 2 2 0 010 4zm-7 4a4 4 0 018 0v1H6v-1z" clipRule="evenodd" />
            </svg>
            Export Report
          </Button>
        </div>
      </div>
      
      {showDatePicker && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
            />
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-surface-500">Total Reports</p>
                <h3 className="text-3xl font-bold mt-1">437</h3>
                <p className="text-sm text-success-500 mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  8.5% from last period
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-surface-500">Avg. Response Time</p>
                <h3 className="text-3xl font-bold mt-1">38 min</h3>
                <p className="text-sm text-success-500 mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  12% improvement
                </p>
              </div>
              <div className="p-3 rounded-full bg-success-500 bg-opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-surface-500">Clearance Rate</p>
                <h3 className="text-3xl font-bold mt-1">72%</h3>
                <p className="text-sm text-warning-500 mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                  </svg>
                  3% decrease
                </p>
              </div>
              <div className="p-3 rounded-full bg-warning-500 bg-opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends & Patterns</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports by Crime Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AnalyticsChart
                    type="doughnut"
                    labels={analyticsData.reportsByType.labels}
                    data={analyticsData.reportsByType.data}
                    colors={analyticsData.reportsByType.colors}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Reports by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AnalyticsChart
                    type="bar"
                    labels={analyticsData.reportsByStatus.labels}
                    data={analyticsData.reportsByStatus.data}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Reports by Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <AnalyticsChart
                  type="bar"
                  labels={analyticsData.reportsByLocation.labels}
                  data={analyticsData.reportsByLocation.data}
                  horizontal={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-6">
          <div className="grid grid-cols-1 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AnalyticsChart
                    type="line"
                    labels={analyticsData.monthlyTrend.labels}
                    data={analyticsData.monthlyTrend.data}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Day of Week Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AnalyticsChart
                    type="bar"
                    labels={analyticsData.weekdayDistribution.labels}
                    data={analyticsData.weekdayDistribution.data}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Hourly Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AnalyticsChart
                    type="line"
                    labels={analyticsData.hourlyDistribution.labels}
                    data={analyticsData.hourlyDistribution.data}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Average Response Time by Crime Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AnalyticsChart
                    type="bar"
                    labels={analyticsData.responseTimeAvg.labels}
                    data={analyticsData.responseTimeAvg.data}
                    yAxisLabel="Minutes"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Clearance Rate by Crime Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AnalyticsChart
                    type="bar"
                    labels={analyticsData.clearanceRate.labels}
                    data={analyticsData.clearanceRate.data}
                    yAxisLabel="Percentage"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="heatmap" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Crime Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <HeatMap
                  center={heatmapData.center}
                  data={heatmapData.data}
                  zoom={13}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
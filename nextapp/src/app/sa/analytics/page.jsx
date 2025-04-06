'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/Tabs';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { AdvancedAnalyticsChart } from '@/components/sa/AdvancedAnalyticsChart';
import { NationalHeatmap } from '@/components/sa/NationalHeatmap';
import { StateComparisonTable } from '@/components/sa/StateComparisonTable';
import { PredictiveAnalysisChart } from '@/components/sa/PredictiveAnalysisChart';
import { InsightCard } from '@/components/sa/InsightCard';

// Mock analytics data
const analyticsData = {
  nationwideReports: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: '2024',
        data: [2450, 2280, 2650, 2820, 2720, 3110, 2980, 3250, 3120, 2940, 2780, 3050],
        borderColor: 'var(--color-primary-500)',
        backgroundColor: 'rgba(0, 112, 243, 0.1)'
      },
      {
        label: '2023',
        data: [2120, 1980, 2240, 2390, 2280, 2550, 2480, 2630, 2570, 2390, 2230, 2440],
        borderColor: 'var(--color-secondary-500)',
        backgroundColor: 'rgba(80, 150, 247, 0.1)'
      }
    ]
  },
  
  crimeDistribution: {
    labels: ['Theft', 'Cybercrime', 'Traffic Violation', 'Assault', 'Burglary', 'Robbery', 'Vandalism', 'Fraud', 'Others'],
    datasets: [
      {
        label: 'Nationwide',
        data: [28, 22, 18, 15, 12, 10, 8, 7, 5],
        backgroundColor: [
          'var(--color-primary-500)',
          'var(--color-primary-400)',
          'var(--color-primary-300)',
          'var(--color-secondary-500)',
          'var(--color-secondary-400)',
          'var(--color-secondary-300)',
          'var(--color-accent-500)',
          'var(--color-accent-400)',
          'var(--color-accent-300)'
        ]
      }
    ]
  },
  
  responseTimeByState: {
    labels: ['Maharashtra', 'Delhi', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Telangana', 'West Bengal', 'Punjab', 'Rajasthan', 'Uttar Pradesh'],
    datasets: [
      {
        label: 'Average Response Time (minutes)',
        data: [32, 28, 35, 37, 33, 42, 38, 40, 45, 47],
        backgroundColor: 'var(--color-primary-500)'
      }
    ]
  },
  
  clearanceRateByState: {
    labels: ['Maharashtra', 'Delhi', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Telangana', 'West Bengal', 'Punjab', 'Rajasthan', 'Uttar Pradesh'],
    datasets: [
      {
        label: 'Clearance Rate (%)',
        data: [82, 78, 75, 84, 79, 72, 76, 71, 68, 65],
        backgroundColor: 'var(--color-success-500)'
      }
    ]
  },
  
  hourlyDistribution: {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Report Volume',
        data: [42, 28, 18, 12, 8, 10, 15, 28, 45, 58, 62, 75, 80, 78, 70, 65, 68, 72, 85, 78, 68, 62, 55, 48],
        borderColor: 'var(--color-primary-500)',
        backgroundColor: 'rgba(0, 112, 243, 0.1)',
        tension: 0.3
      }
    ]
  },
  
  weekdayDistribution: {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      {
        label: 'Report Volume',
        data: [650, 520, 545, 580, 620, 780, 840],
        backgroundColor: 'var(--color-secondary-500)',
      }
    ]
  },
  
  geographicHotspots: [
    { lat: 19.0760, lng: 72.8777, weight: 0.95, name: 'Mumbai' }, // Mumbai
    { lat: 28.6139, lng: 77.2090, weight: 0.9, name: 'Delhi' }, // Delhi
    { lat: 12.9716, lng: 77.5946, weight: 0.85, name: 'Bangalore' }, // Bangalore
    { lat: 23.0225, lng: 72.5714, weight: 0.8, name: 'Ahmedabad' }, // Ahmedabad
    { lat: 13.0827, lng: 80.2707, weight: 0.78, name: 'Chennai' }, // Chennai
    { lat: 17.3850, lng: 78.4867, weight: 0.75, name: 'Hyderabad' }, // Hyderabad
    { lat: 22.5726, lng: 88.3639, weight: 0.72, name: 'Kolkata' }, // Kolkata
    { lat: 18.5204, lng: 73.8567, weight: 0.7, name: 'Pune' }, // Pune
    { lat: 30.7333, lng: 76.7794, weight: 0.65, name: 'Chandigarh' }, // Chandigarh
    { lat: 26.9124, lng: 75.7873, weight: 0.63, name: 'Jaipur' }, // Jaipur
    { lat: 25.5941, lng: 85.1376, weight: 0.62, name: 'Patna' }, // Patna
    { lat: 26.8467, lng: 80.9462, weight: 0.6, name: 'Lucknow' }, // Lucknow
  ],
  
  predictiveAnalysis: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Historical Data',
        data: [2450, 2280, 2650, 2820, 2720, 3110, 2980, 3250, 3120, 2940, 2780, 3050],
        borderColor: 'var(--color-primary-500)',
        backgroundColor: 'transparent',
        borderWidth: 2
      },
      {
        label: 'Predicted Trend',
        data: [3050, 2850, 3150, 3350, 3250, 3650, 3580, 3850, 3720, 3550, 3350, 3650],
        borderColor: 'var(--color-warning-500)',
        backgroundColor: 'rgba(255, 192, 0, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5]
      }
    ]
  },
  
  stateComparison: [
    { 
      state: 'Maharashtra', 
      totalReports: 5230, 
      resolvedRate: 82, 
      avgResponseTime: 32, 
      totalOfficers: 240, 
      stations: 18,
      changeFromLastPeriod: 8.5
    },
    { 
      state: 'Delhi', 
      totalReports: 4120, 
      resolvedRate: 78, 
      avgResponseTime: 28, 
      totalOfficers: 185, 
      stations: 12,
      changeFromLastPeriod: 12.3
    },
    { 
      state: 'Karnataka', 
      totalReports: 3850, 
      resolvedRate: 75, 
      avgResponseTime: 35, 
      totalOfficers: 165, 
      stations: 14,
      changeFromLastPeriod: 10.2
    },
    { 
      state: 'Gujarat', 
      totalReports: 2980, 
      resolvedRate: 84, 
      avgResponseTime: 37, 
      totalOfficers: 130, 
      stations: 10,
      changeFromLastPeriod: 6.8
    },
    { 
      state: 'Tamil Nadu', 
      totalReports: 3210, 
      resolvedRate: 79, 
      avgResponseTime: 33, 
      totalOfficers: 145, 
      stations: 12,
      changeFromLastPeriod: 9.5
    },
    { 
      state: 'Telangana', 
      totalReports: 2650, 
      resolvedRate: 72, 
      avgResponseTime: 42, 
      totalOfficers: 120, 
      stations: 8,
      changeFromLastPeriod: 7.2
    },
    { 
      state: 'West Bengal', 
      totalReports: 2860, 
      resolvedRate: 76, 
      avgResponseTime: 38, 
      totalOfficers: 125, 
      stations: 9,
      changeFromLastPeriod: 5.4
    },
    { 
      state: 'Punjab', 
      totalReports: 2320, 
      resolvedRate: 71, 
      avgResponseTime: 40, 
      totalOfficers: 105, 
      stations: 7,
      changeFromLastPeriod: 4.3
    }
  ],
  
  insights: [
    {
      title: 'Cybercrime Increase',
      description: 'Cybercrime reports have increased by 28% compared to the same period last year, with identity theft being the most common complaint.',
      severity: 'high',
      icon: 'computer',
      actionable: true
    },
    {
      title: 'Response Time Improvement',
      description: 'The national average response time has improved by 12% in the last quarter, with Gujarat showing the most improvement (20%).',
      severity: 'positive',
      icon: 'clock',
      actionable: false
    },
    {
      title: 'Urban vs Rural Pattern',
      description: 'Urban areas show a 3X higher report rate than rural areas, but rural areas show 15% longer response times on average.',
      severity: 'medium',
      icon: 'location',
      actionable: true
    },
    {
      title: 'Weekend Crime Spike',
      description: 'Crime reports peak on Saturday nights between 10pm-2am, with a 40% increase compared to weekday evenings.',
      severity: 'medium',
      icon: 'calendar',
      actionable: true
    }
  ]
};

// Time period options
const timePeriods = [
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'last90days', label: 'Last 90 Days' },
  { value: 'lastYear', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' }
];

// Crime type options
const crimeTypes = [
  { value: 'all', label: 'All Crime Types' },
  { value: 'theft', label: 'Theft' },
  { value: 'cybercrime', label: 'Cybercrime' },
  { value: 'trafficViolation', label: 'Traffic Violation' },
  { value: 'assault', label: 'Assault' },
  { value: 'burglary', label: 'Burglary' }
];

// Geography options 
const geographyOptions = [
  { value: 'all', label: 'All India' },
  { value: 'north', label: 'North India' },
  { value: 'south', label: 'South India' },
  { value: 'east', label: 'East India' },
  { value: 'west', label: 'West India' }
];

export default function SuperAdminAnalytics() {
  const [timePeriod, setTimePeriod] = useState('last30days');
  const [crimeType, setCrimeType] = useState('all');
  const [geography, setGeography] = useState('all');
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
  
  const handleGeographyChange = (e) => {
    setGeography(e.target.value);
  };
  
  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };
  
  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Advanced Analytics</h1>
          <p className="text-surface-500 mt-1">
            Comprehensive nationwide crime analytics and predictive insights
          </p>
        </div>
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
          <Select
            name="geography"
            value={geography}
            onChange={handleGeographyChange}
            options={geographyOptions}
            className="w-full sm:w-48"
          />
          <Button variant="outline" onClick={() => setShowDatePicker(!showDatePicker)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Date Range
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {analyticsData.insights.map((insight, index) => (
          <InsightCard key={index} insight={insight} />
        ))}
      </div>
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="geographic">Geographic Analysis</TabsTrigger>
          <TabsTrigger value="temporal">Temporal Analysis</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="comparison">State Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Nationwide Report Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AdvancedAnalyticsChart
                    type="line"
                    data={analyticsData.nationwideReports}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Crime Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AdvancedAnalyticsChart
                    type="doughnut"
                    data={analyticsData.crimeDistribution}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance by State</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AdvancedAnalyticsChart
                    type="bar"
                    data={analyticsData.clearanceRateByState}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="geographic" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>National Crime Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <NationalHeatmap 
                  hotspots={analyticsData.geographicHotspots}
                  crimeType={crimeType}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Average Response Time by State</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AdvancedAnalyticsChart
                    type="bar"
                    data={analyticsData.responseTimeByState}
                    horizontal={true}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Clearance Rate by State</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AdvancedAnalyticsChart
                    type="bar"
                    data={analyticsData.clearanceRateByState}
                    horizontal={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="temporal" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Distribution of Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AdvancedAnalyticsChart
                    type="line"
                    data={analyticsData.hourlyDistribution}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Day of Week Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AdvancedAnalyticsChart
                    type="bar"
                    data={analyticsData.weekdayDistribution}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Seasonal Patterns Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <AdvancedAnalyticsChart
                  type="line"
                  data={analyticsData.nationwideReports}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="predictive" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Crime Trend Prediction (Next 12 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <PredictiveAnalysisChart
                  data={analyticsData.predictiveAnalysis}
                />
              </div>
              <div className="mt-4 p-4 bg-surface-50 rounded-lg">
                <h3 className="font-medium text-foreground mb-2">Prediction Insights</h3>
                <p className="text-surface-600 text-sm">
                  Based on historical data and current trends, we predict an average increase of 18.5% in overall reported incidents over the next 12 months. Cybercrime is expected to see the highest growth rate at 32.3%, while physical theft cases are projected to remain relatively stable with a 2.1% increase.
                </p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-sm font-medium text-surface-600">Overall Growth</p>
                    <p className="text-lg font-bold text-foreground">+18.5%</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-sm font-medium text-surface-600">Highest Growth</p>
                    <p className="text-lg font-bold text-error-500">Cybercrime (+32.3%)</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-sm font-medium text-surface-600">Confidence Level</p>
                    <p className="text-lg font-bold text-foreground">87%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Allocation Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
                    <h3 className="font-medium text-foreground">Cybercrime Division</h3>
                    <p className="text-sm text-surface-600 mt-1">
                      Recommend increasing cybercrime division staffing by 25% and technology resources by 35% to address projected increase in digital crime.
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className="text-xs font-medium bg-primary-500 text-white px-2 py-0.5 rounded-full">High Priority</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-surface-50 rounded-lg border border-surface-200">
                    <h3 className="font-medium text-foreground">Mumbai Metropolitan Region</h3>
                    <p className="text-sm text-surface-600 mt-1">
                      Data indicates 18% resource deficit in Mumbai region based on incident volume. Recommend reallocation of 12 officers from lower-volume stations.
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className="text-xs font-medium bg-warning-500 text-white px-2 py-0.5 rounded-full">Medium Priority</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-surface-50 rounded-lg border border-surface-200">
                    <h3 className="font-medium text-foreground">Weekend Coverage</h3>
                    <p className="text-sm text-surface-600 mt-1">
                      Weekend incident rates are 40% higher than weekdays. Recommend adjusting shift patterns to increase weekend coverage by 30%.
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className="text-xs font-medium bg-warning-500 text-white px-2 py-0.5 rounded-full">Medium Priority</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-surface-50 rounded-lg border border-surface-200">
                    <h3 className="font-medium text-foreground">Training Focus</h3>
                    <p className="text-sm text-surface-600 mt-1">
                      Digital forensics capabilities showing 28% gap compared to case requirements. Recommend specialized training program for 120 officers.
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className="text-xs font-medium bg-info-500 text-white px-2 py-0.5 rounded-full">Ongoing</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Hotspot Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-4">
                  <NationalHeatmap 
                    hotspots={analyticsData.geographicHotspots}
                    isPredictive={true}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-surface-50 rounded">
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-error-500 mr-2"></span>
                      <span className="text-sm font-medium">Mumbai Central</span>
                    </div>
                    <span className="text-sm font-medium">95% confidence</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-surface-50 rounded">
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-error-500 mr-2"></span>
                      <span className="text-sm font-medium">Delhi Connaught Place</span>
                    </div>
                    <span className="text-sm font-medium">92% confidence</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-surface-50 rounded">
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-warning-500 mr-2"></span>
                      <span className="text-sm font-medium">Bangalore Koramangala</span>
                    </div>
                    <span className="text-sm font-medium">88% confidence</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-surface-50 rounded">
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-warning-500 mr-2"></span>
                      <span className="text-sm font-medium">Ahmedabad Navrangpura</span>
                    </div>
                    <span className="text-sm font-medium">85% confidence</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="comparison" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>State Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <StateComparisonTable 
                data={analyticsData.stateComparison}
              />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AdvancedAnalyticsChart
                    type="bar"
                    data={analyticsData.responseTimeByState}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Clearance Rate Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AdvancedAnalyticsChart
                    type="bar"
                    data={analyticsData.clearanceRateByState}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-10 grid grid-cols-1 gap-6">
        <Card className="bg-surface-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <h3 className="text-lg font-bold mb-2">Data Quality Report</h3>
                <p className="text-sm text-surface-600 mb-4">
                  The following metrics indicate the quality and reliability of the data used in this analysis.
                </p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-surface-500">Completeness</span>
                      <span className="text-xs font-medium text-surface-700">98.3%</span>
                    </div>
                    <div className="w-full bg-surface-200 rounded-full h-1.5">
                      <div className="bg-success-500 h-1.5 rounded-full" style={{ width: '98.3%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-surface-500">Accuracy</span>
                      <span className="text-xs font-medium text-surface-700">95.8%</span>
                    </div>
                    <div className="w-full bg-surface-200 rounded-full h-1.5">
                      <div className="bg-success-500 h-1.5 rounded-full" style={{ width: '95.8%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-surface-500">Timeliness</span>
                      <span className="text-xs font-medium text-surface-700">99.1%</span>
                    </div>
                    <div className="w-full bg-surface-200 rounded-full h-1.5">
                      <div className="bg-success-500 h-1.5 rounded-full" style={{ width: '99.1%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-surface-500">Consistency</span>
                      <span className="text-xs font-medium text-surface-700">96.5%</span>
                    </div>
                    <div className="w-full bg-surface-200 rounded-full h-1.5">
                      <div className="bg-success-500 h-1.5 rounded-full" style={{ width: '96.5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-lg font-bold mb-2">Strategic Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h4 className="font-medium text-foreground mb-2">Cybercrime Prevention</h4>
                    <p className="text-sm text-surface-600">
                      Launch nationwide cybercrime awareness campaign targeting vulnerable demographics, with focus on identity theft and financial fraud prevention.
                    </p>
                    <div className="mt-3">
                      <span className="text-xs font-medium text-primary-600">Based on 28% YoY increase</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h4 className="font-medium text-foreground mb-2">Resource Redistribution</h4>
                    <p className="text-sm text-surface-600">
                      Implement dynamic resource allocation model, transferring 15% of resources from low-crime areas to identified hotspots during peak times.
                    </p>
                    <div className="mt-3">
                      <span className="text-xs font-medium text-primary-600">Potential 22% efficiency gain</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h4 className="font-medium text-foreground mb-2">Weekend Coverage</h4>
                    <p className="text-sm text-surface-600">
                      Adjust shift patterns nationwide to increase weekend coverage by 30%, particularly focusing on urban areas between 10pm-2am.
                    </p>
                    <div className="mt-3">
                      <span className="text-xs font-medium text-primary-600">Addressing 40% higher incident rate</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
                  <h4 className="font-medium text-foreground mb-2">Long-term Recommendation</h4>
                  <p className="text-sm text-surface-600">
                    Develop integrated predictive policing capabilities by investing in AI-driven analytics that can forecast crime patterns with higher accuracy. Implement real-time resource allocation based on predictive models that combine historical data with emerging patterns. Launch a phased approach beginning with major metropolitan areas and expanding to tier 2 cities within 18 months.
                  </p>
                  <div className="mt-3 flex justify-between">
                    <span className="text-xs font-medium text-primary-600">Expected ROI: 3.5x over 24 months</span>
                    <span className="text-xs font-medium text-surface-500">Confidence: High (92%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
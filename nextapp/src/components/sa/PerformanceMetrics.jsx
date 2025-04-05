// components/sa/PerformanceMetrics.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';

export function PerformanceMetrics({
  data = {},
  className = '',
  ...props
}) {
  // In a real implementation, you would use a charting library
  // This is a placeholder showing how the component would be structured
  
  const metrics = [
    {
      name: 'Response Time',
      value: data.responseTime || '24 hours',
      change: data.responseTimeChange || '+5%',
      trend: data.responseTimeTrend || 'up',
    },
    {
      name: 'Resolution Rate',
      value: data.resolutionRate || '75%',
      change: data.resolutionRateChange || '+3%',
      trend: data.resolutionRateTrend || 'up',
    },
    {
      name: 'User Satisfaction',
      value: data.satisfaction || '4.2/5',
      change: data.satisfactionChange || '+0.2',
      trend: data.satisfactionTrend || 'up',
    },
    {
      name: 'Reports per Station',
      value: data.reportsPerStation || '42',
      change: data.reportsPerStationChange || '-5%',
      trend: data.reportsPerStationTrend || 'down',
    }
  ];
  
  const renderTrendIcon = (trend) => {
    if (trend === 'up') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-error-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 10.586 3.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-surface-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    );
  };
  
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <div key={metric.name} className="bg-surface-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-surface-500">{metric.name}</h3>
              <p className="text-2xl font-bold mt-1">{metric.value}</p>
              <div className="flex items-center mt-2">
                {renderTrendIcon(metric.trend)}
                <span
                  className={`ml-1 text-sm font-medium 
                    ${metric.trend === 'up' ? 'text-success-500' : 
                      metric.trend === 'down' ? 'text-error-500' : 
                      'text-surface-500'}`}
                >
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Response Time Trend</h3>
          <div className="w-full h-64 bg-surface-50 rounded-md flex items-center justify-center">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-surface-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <div className="text-surface-500">Response Time Line Chart</div>
              <div className="text-xs text-surface-400 mt-1">
                This is a placeholder for a real chart implementation
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Top Performing Stations</h3>
            <div className="space-y-4">
              {(data.topStations || [
                { name: 'Ahmedabad Central', score: 95 },
                { name: 'Surat City', score: 92 },
                { name: 'Rajkot East', score: 88 }
              ]).map((station, index) => (
                <div key={index} className="bg-surface-50 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium">{station.name}</h4>
                      </div>
                    </div>
                    <div className="font-bold">{station.score}/100</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Needs Improvement</h3>
            <div className="space-y-4">
              {(data.lowPerformingStations || [
                { name: 'Bhuj West', score: 65 },
                { name: 'Anand Rural', score: 68 },
                { name: 'Jamnagar South', score: 72 }
              ]).map((station, index) => (
                <div key={index} className="bg-surface-50 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-error-100 text-error-700 flex items-center justify-center font-medium">
                        !
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium">{station.name}</h4>
                      </div>
                    </div>
                    <div className="font-bold">{station.score}/100</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
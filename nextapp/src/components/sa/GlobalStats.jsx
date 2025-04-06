// components/sa/GlobalStats.jsx
import React from 'react';
import { Card, CardContent } from '../common/Card';

export function GlobalStats({
  stats = {},
  className = '',
  ...props
}) {
  const statItems = [
    {
      key: 'totalReports',
      label: 'Total Reports',
      value: stats.totalReports || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      trend: stats.reportsTrend || 'neutral',
      trendValue: stats.reportsTrendValue || '0%'
    },
    {
      key: 'solvedCases',
      label: 'Solved Cases',
      value: stats.solvedCases || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      trend: stats.solvedTrend || 'up',
      trendValue: stats.solvedTrendValue || '0%'
    },
    {
      key: 'pendingCases',
      label: 'Pending Cases',
      value: stats.pendingCases || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      trend: stats.pendingTrend || 'neutral',
      trendValue: stats.pendingTrendValue || '0%'
    },
    {
      key: 'activeStations',
      label: 'Active Stations',
      value: stats.activeStations || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-info-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      trend: 'neutral',
      trendValue: '0%'
    }
  ];
  
  const renderTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
        );
      case 'down':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-error-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 10.586 3.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-surface-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  return (
    <div 
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
      {...props}
    >
      {statItems.map((stat) => (
        <Card key={stat.key} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-full bg-surface-100">
                {stat.icon}
              </div>
              <div className="flex items-center space-x-1">
                {renderTrendIcon(stat.trend)}
                <span className={`text-sm font-medium 
                  ${stat.trend === 'up' ? 'text-success-500' : 
                    stat.trend === 'down' ? 'text-error-500' : 
                    'text-surface-500'}`}
                >
                  {stat.trendValue}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-surface-500 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold mt-1">{stat.value.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
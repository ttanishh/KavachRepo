// components/a/AnalyticsChart.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';

export function AnalyticsChart({
  title,
  description,
  type = 'bar',
  data = {},
  height = '300px',
  className = '',
  ...props
}) {
  // In a real application, you would integrate with a charting library
  // like Chart.js, Recharts, or D3.js
  // This is a placeholder for demonstration
  
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };
  
  const renderBarChart = () => (
    <div 
      style={{ height }}
      className="w-full bg-surface-50 rounded-md flex items-center justify-center"
    >
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-surface-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <div className="text-surface-500">Bar Chart: {title}</div>
        <div className="text-xs text-surface-400 mt-1">
          This is a placeholder for a real chart implementation
        </div>
      </div>
    </div>
  );
  
  const renderLineChart = () => (
    <div 
      style={{ height }}
      className="w-full bg-surface-50 rounded-md flex items-center justify-center"
    >
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-surface-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        <div className="text-surface-500">Line Chart: {title}</div>
        <div className="text-xs text-surface-400 mt-1">
          This is a placeholder for a real chart implementation
        </div>
      </div>
    </div>
  );
  
  const renderPieChart = () => (
    <div 
      style={{ height }}
      className="w-full bg-surface-50 rounded-md flex items-center justify-center"
    >
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-surface-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        <div className="text-surface-500">Pie Chart: {title}</div>
        <div className="text-xs text-surface-400 mt-1">
          This is a placeholder for a real chart implementation
        </div>
      </div>
    </div>
  );
  
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-surface-500 mt-1">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}
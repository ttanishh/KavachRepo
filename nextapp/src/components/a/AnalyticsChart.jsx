'use client';

// components/a/AnalyticsChart.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';

export function AnalyticsChart({ 
  type = 'line', 
  labels = [], 
  data = [], 
  horizontal = false, 
  height = '100%',
  width = '100%',
  dataSets = null,
  colorScheme = ['#0070F3', '#5096F7', '#79B7F9', '#A1CCFB', '#C8E1FD', '#E6F0FE'],
  title,
  description,
  className = '',
  ...props
}) {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // This is a placeholder for an actual chart library
  // In a real implementation, you would use something like Chart.js, Recharts, or D3.js
  
  const renderChart = () => {
    switch (type) {
      case 'line':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      case 'doughnut':
        return renderDoughnutChart();
      default:
        return renderLineChart();
    }
  };

  const renderLineChart = () => {
    // Simple placeholder for a line chart
    const dataPoints = dataSets ? dataSets[0].data : data;
    const maxValue = Math.max(...dataPoints);
    
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 border-b border-l border-surface-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute w-full border-t border-surface-100" style={{ top: `${20 * i}%` }}>
                <span className="absolute -left-1 -top-3 text-xs text-surface-400">
                  {Math.round(maxValue - (maxValue * (i * 0.2)))}
                </span>
              </div>
            ))}
          </div>
          
          {/* Data line */}
          <svg className="absolute inset-0" viewBox={`0 0 ${labels.length - 1} 100`} preserveAspectRatio="none">
            <path
              d={dataPoints.map((point, i) => {
                const x = i;
                const y = 100 - (point / maxValue * 100);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              stroke="#0070F3"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          
          {/* Data points */}
          <div className="absolute inset-0 flex justify-between items-end">
            {dataPoints.map((point, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className="w-2 h-2 rounded-full bg-primary-500 mb-1 z-10"
                  style={{ marginBottom: `${(point / maxValue * 100)}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="h-6 flex justify-between text-xs text-surface-500 pt-1">
          {labels.map((label, i) => (
            <div key={i} className="truncate max-w-[50px] text-center">
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBarChart = () => {
    // Simple placeholder for a bar chart
    const maxValue = Math.max(...data);
    
    return (
      <div className="w-full h-full flex">
        {horizontal ? (
          <>
            {/* Y-axis labels */}
            <div className="w-24 flex flex-col justify-between text-xs text-surface-500 py-2">
              {labels.map((label, i) => (
                <div key={i} className="truncate max-w-[80px]">
                  {label}
                </div>
              ))}
            </div>
            
            {/* Bars */}
            <div className="flex-1 flex flex-col justify-between py-2">
              {data.map((value, i) => (
                <div key={i} className="h-4 flex items-center">
                  <div 
                    className="h-4 bg-primary-500 rounded-r-sm"
                    style={{ 
                      width: `${(value / maxValue * 100)}%`,
                      backgroundColor: colorScheme[i % colorScheme.length]
                    }}
                  ></div>
                  <span className="ml-2 text-xs font-medium text-surface-700">{value}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 border-b border-l border-surface-200">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="absolute w-full border-t border-surface-100" style={{ top: `${20 * i}%` }}>
                    <span className="absolute -left-1 -top-3 text-xs text-surface-400">
                      {Math.round(maxValue - (maxValue * (i * 0.2)))}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Bars */}
              <div className="absolute inset-0 flex justify-around items-end px-4">
                {data.map((value, i) => (
                  <div key={i} className="flex flex-col items-center" style={{ width: `${100 / data.length}%` }}>
                    <div 
                      className="w-full max-w-[30px] bg-primary-500 rounded-t-sm"
                      style={{ 
                        height: `${(value / maxValue * 100)}%`,
                        backgroundColor: colorScheme[i % colorScheme.length]
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* X-axis labels */}
            <div className="h-6 flex justify-around text-xs text-surface-500 pt-1">
              {labels.map((label, i) => (
                <div key={i} className="truncate max-w-[50px] text-center">
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDoughnutChart = () => {
    // Simple placeholder for a doughnut chart
    const total = data.reduce((sum, value) => sum + value, 0);
    let accumulatedPercentage = 0;
    
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="relative w-3/4 h-3/4">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {data.map((value, i) => {
              const percentage = value / total * 100;
              const startAngle = accumulatedPercentage;
              accumulatedPercentage += percentage;
              const endAngle = accumulatedPercentage;
              
              const x1 = 50 + 40 * Math.cos((startAngle / 100) * 2 * Math.PI);
              const y1 = 50 + 40 * Math.sin((startAngle / 100) * 2 * Math.PI);
              const x2 = 50 + 40 * Math.cos((endAngle / 100) * 2 * Math.PI);
              const y2 = 50 + 40 * Math.sin((endAngle / 100) * 2 * Math.PI);
              
              const largeArcFlag = percentage > 50 ? 1 : 0;
              
              return (
                <path
                  key={i}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={colorScheme[i % colorScheme.length]}
                />
              );
            })}
            <circle cx="50" cy="50" r="20" fill="white" />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-bold text-surface-700">{total}</div>
            <div className="text-xs text-surface-500">Total</div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="ml-4 space-y-2">
          {labels.map((label, i) => (
            <div key={i} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-sm mr-2"
                style={{ backgroundColor: colorScheme[i % colorScheme.length] }}
              ></div>
              <span className="text-xs text-surface-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-3"></div>
          <p className="text-surface-500 text-sm">Loading chart...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-surface-500 mt-1">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div 
          ref={chartRef}
          className="w-full h-full"
          style={{ height, width }}
        >
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
}
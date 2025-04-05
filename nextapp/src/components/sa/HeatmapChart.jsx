// components/sa/HeatmapChart.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Map } from '../common/Map';

export function HeatmapChart({
  center = [23.0225, 72.5714], // Default to Ahmedabad, Gujarat
  data = [],
  title = 'Crime Heatmap',
  description,
  filters = [],
  onFilterChange,
  className = '',
  ...props
}) {
  // In a real implementation, this would use a mapping library's heatmap functionality
  // This is a placeholder for demonstration purposes
  
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <p className="text-sm text-surface-500 mt-1">{description}</p>
            )}
          </div>
          {filters.length > 0 && (
            <div className="flex space-x-2">
              {filters.map((filter) => (
                <select
                  key={filter.name}
                  name={filter.name}
                  value={filter.value}
                  onChange={(e) => onFilterChange(filter.name, e.target.value)}
                  className="text-sm rounded-md border-surface-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                >
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Map
            center={center}
            markers={[]}
            zoom={11}
            height="400px"
          />
          <div className="absolute top-4 right-4 bg-surface-0 bg-opacity-80 p-3 rounded-md shadow-sm">
            <h4 className="text-sm font-medium mb-2">Legend</h4>
            <div className="space-y-1">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-error-500 mr-2"></div>
                <span className="text-xs">High Density</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-warning-500 mr-2"></div>
                <span className="text-xs">Medium Density</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-success-500 mr-2"></div>
                <span className="text-xs">Low Density</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface-100 p-3 rounded-md">
            <h4 className="text-sm font-medium text-surface-700 mb-1">Total Incidents</h4>
            <p className="text-lg font-bold">{data.length || 0}</p>
          </div>
          <div className="bg-surface-100 p-3 rounded-md">
            <h4 className="text-sm font-medium text-surface-700 mb-1">Hotspots</h4>
            <p className="text-lg font-bold">{Math.floor(Math.random() * 10) + 1}</p>
          </div>
          <div className="bg-surface-100 p-3 rounded-md">
            <h4 className="text-sm font-medium text-surface-700 mb-1">Time Period</h4>
            <p className="text-lg font-bold">Last 30 Days</p>
          </div>
          <div className="bg-surface-100 p-3 rounded-md">
            <h4 className="text-sm font-medium text-surface-700 mb-1">Most Common</h4>
            <p className="text-lg font-bold">Theft</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
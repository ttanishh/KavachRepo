// components/a/StationMap.jsx
import React from 'react';
import { Map } from '../common/Map';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';

export function StationMap({
  stationLocation = { lat: 23.0225, lng: 72.5714 }, // Default to Ahmedabad, Gujarat
  reportsLocations = [],
  className = '',
  ...props
}) {
  // Format the markers
  const markers = [
    {
      position: [stationLocation.lat, stationLocation.lng],
      type: 'station',
      label: 'Police Station'
    },
    ...reportsLocations.map(report => ({
      position: [report.location.lat, report.location.lng],
      type: 'report',
      label: report.title,
      id: report.id,
      status: report.status
    }))
  ];
  
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Jurisdiction Map</CardTitle>
      </CardHeader>
      <CardContent>
        <Map
          center={[stationLocation.lat, stationLocation.lng]}
          markers={markers}
          zoom={12}
          height="400px"
        />
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-primary-500 mr-2"></div>
            <span className="text-xs text-surface-600">Police Station</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-error-500 mr-2"></div>
            <span className="text-xs text-surface-600">Active Reports</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
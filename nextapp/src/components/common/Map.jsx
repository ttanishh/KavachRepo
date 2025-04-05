// components/common/Map.jsx
import React, { useEffect, useRef } from 'react';

export function Map({
  center = [23.0225, 72.5714], // Default to Ahmedabad, Gujarat
  zoom = 12,
  markers = [],
  onClick,
  height = '400px',
  width = '100%',
  className = '',
  ...props
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  useEffect(() => {
    // This is a placeholder for map integration
    // In a real application, you would integrate with Google Maps, Mapbox, or Leaflet
    console.log('Map would initialize here with center:', center, 'and zoom:', zoom);
    
    // Mock implementation for demonstration
    const mapContainer = mapRef.current;
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background-color: #e2e8f0; color: #64748b;">
          <div>
            <div style="text-align: center;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="width: 48px; height: 48px; margin: 0 auto 16px auto;">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <p>Map centered at: [${center[0]}, ${center[1]}]</p>
              <p>Zoom level: ${zoom}</p>
              <p>Markers: ${markers.length}</p>
            </div>
          </div>
        </div>
      `;
    }
    
    return () => {
      // Cleanup would happen here
    };
  }, [center, zoom, markers]);
  
  return (
    <div 
      ref={mapRef}
      style={{ height, width }}
      className={`relative rounded-md border border-surface-200 overflow-hidden ${className}`}
      onClick={(e) => onClick && onClick(e)}
      {...props}
    />
  );
}
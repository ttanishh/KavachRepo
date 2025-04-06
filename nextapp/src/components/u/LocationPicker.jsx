// components/u/LocationPicker.jsx
import React, { useState, useEffect } from 'react';
import { Map } from '../common/Map';
import { Button } from '../common/Button';

export function LocationPicker({
  initialLocation = { lat: 23.0225, lng: 72.5714 }, // Default to Ahmedabad, Gujarat
  onChange,
  className = '',
  ...props
}) {
  const [location, setLocation] = useState(initialLocation);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // This would do a reverse geocode in a real app
    // For demo purposes, we're just creating a fake address
    const newAddress = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
    setAddress(newAddress);
    
    if (onChange) {
      onChange({ location, address: newAddress });
    }
  }, [location, onChange]);
  
  const handleMapClick = (e) => {
    // In a real implementation, this would extract lat/lng from the map click event
    // For now, let's just add some randomness to the current location
    const lat = location.lat + (Math.random() * 0.01 - 0.005);
    const lng = location.lng + (Math.random() * 0.01 - 0.005);
    setLocation({ lat, lng });
  };
  
  const getCurrentLocation = () => {
    setIsLoading(true);
    
    // This would use the browser's geolocation API in a real app
    // For demo purposes, we're just simulating a delay and setting a location near Ahmedabad
    setTimeout(() => {
      const lat = 23.0225 + (Math.random() * 0.05 - 0.025);
      const lng = 72.5714 + (Math.random() * 0.05 - 0.025);
      setLocation({ lat, lng });
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className={`space-y-3 ${className}`} {...props}>
      <Map
        center={[location.lat, location.lng]}
        markers={[{ position: [location.lat, location.lng] }]}
        onClick={handleMapClick}
        height="300px"
        className="rounded-lg border border-surface-200"
      />
      
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="text-surface-500">Selected Location: </span>
          <span className="font-medium">{address}</span>
        </div>
        
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={getCurrentLocation}
          isLoading={isLoading}
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Use Current Location
        </Button>
      </div>
    </div>
  );
}
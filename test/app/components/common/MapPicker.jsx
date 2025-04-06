'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MapPicker = ({ 
  initialLocation = { lat: 21.1702, lng: 72.8311 }, // Default to Surat, Gujarat
  onLocationChange,
  height = '400px',
  showSearch = true,
  interactive = true,
  markers = []
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [location, setLocation] = useState(initialLocation);
  const mapMarkers = useRef([]);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [initialLocation.lng, initialLocation.lat],
      zoom: 12,
      interactive
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    
    if (interactive) {
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }),
        'bottom-right'
      );

      if (showSearch) {
        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          marker: false,
          placeholder: 'Search for a location',
        });
        
        map.current.addControl(geocoder);
        document.querySelector('.mapboxgl-ctrl-geocoder').classList.add('geocoder-container');
      }

      // Add marker at initial location
      marker.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat([initialLocation.lng, initialLocation.lat])
        .addTo(map.current);

      // Update coordinates after marker drag
      marker.current.on('dragend', () => {
        const lngLat = marker.current.getLngLat();
        setLocation({ lat: lngLat.lat, lng: lngLat.lng });
        onLocationChange?.({ lat: lngLat.lat, lng: lngLat.lng });
      });

      // Handle map click to move marker
      map.current.on('click', (e) => {
        marker.current.setLngLat(e.lngLat);
        setLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng });
        onLocationChange?.({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Add external markers
  useEffect(() => {
    if (!map.current || !markers?.length) return;

    // Clear previous markers
    mapMarkers.current.forEach(m => m.remove());
    mapMarkers.current = [];

    // Add new markers
    markers.forEach(m => {
      const { lat, lng, color = '#FF0000', popup } = m;
      
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = color;
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';

      const newMarker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map.current);
      
      if (popup) {
        const popupContent = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<div class="text-sm">${popup}</div>`);
        
        newMarker.setPopup(popupContent);
      }
      
      mapMarkers.current.push(newMarker);
    });

  }, [markers]);

  // Update marker if initialLocation changes
  useEffect(() => {
    if (map.current && marker.current && (
      initialLocation.lat !== location.lat || 
      initialLocation.lng !== location.lng
    )) {
      marker.current.setLngLat([initialLocation.lng, initialLocation.lat]);
      map.current.flyTo({
        center: [initialLocation.lng, initialLocation.lat],
        zoom: 14,
        essential: true
      });
      setLocation(initialLocation);
    }
  }, [initialLocation]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-md" style={{ height }}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MapPicker;


import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Crime } from "@/types";
import { AlertTriangle } from "lucide-react";

interface MapProps {
  crimes?: Crime[];
  onLocationSelect?: (lat: number, lng: number, address?: string) => void;
  selectedLocation?: { lat: number; lng: number };
  interactive?: boolean;
}

const Map = ({ 
  crimes = [], 
  onLocationSelect, 
  selectedLocation,
  interactive = true
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Default center on Surat, India
  const defaultCenter = { lat: 21.1702, lng: 72.8311 };
  
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: "AIzaSyDhCDuGbjOm9t-2_oAxnjeomWH1PuVl-Ik",
          version: "weekly",
          libraries: ["places"]
        });
        
        const google = await loader.load();
        
        if (mapRef.current) {
          const mapOptions: google.maps.MapOptions = {
            center: selectedLocation || defaultCenter,
            zoom: 13,
            mapTypeControl: true,
            fullscreenControl: true,
            streetViewControl: false,
            mapId: "CRIME_MAP_BASIC",
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          };
          
          const map = new google.maps.Map(mapRef.current, mapOptions);
          mapInstanceRef.current = map;
          setMapLoaded(true);
          
          if (interactive) {
            // Add click listener for interactive maps
            map.addListener("click", (e: google.maps.MapMouseEvent) => {
              if (onLocationSelect && e.latLng) {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                
                // Reverse geocoding to get address
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                  if (status === "OK" && results && results[0]) {
                    onLocationSelect(lat, lng, results[0].formatted_address);
                  } else {
                    onLocationSelect(lat, lng);
                  }
                });
                
                // Update the selected location marker
                if (selectedLocation) {
                  // Clear any existing selection markers
                  markersRef.current.forEach(marker => {
                    if (marker.getTitle() === "Selected Location") {
                      marker.setMap(null);
                    }
                  });
                  markersRef.current = markersRef.current.filter(
                    marker => marker.getTitle() !== "Selected Location"
                  );
                }
                
                const marker = new google.maps.Marker({
                  position: { lat, lng },
                  map,
                  title: "Selected Location",
                  icon: {
                    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
                      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00829b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
                    ),
                    scaledSize: new google.maps.Size(36, 36),
                  },
                  animation: google.maps.Animation.DROP,
                  zIndex: 10
                });
                
                markersRef.current.push(marker);
              }
            });
          }
          
          // Add search box if interactive
          if (interactive) {
            const input = document.createElement("input");
            input.className = "bg-white shadow-md rounded-md px-3 py-2 w-64 mb-2";
            input.placeholder = "Search for a location";
            
            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);
            
            const autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo("bounds", map);
            
            autocomplete.addListener("place_changed", () => {
              const place = autocomplete.getPlace();
              
              if (!place.geometry || !place.geometry.location) {
                return;
              }
              
              if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
              } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
              }
              
              if (onLocationSelect) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const address = place.formatted_address;
                
                // Update the selected location marker
                if (selectedLocation) {
                  // Clear existing selection markers
                  markersRef.current.forEach(marker => {
                    if (marker.getTitle() === "Selected Location") {
                      marker.setMap(null);
                    }
                  });
                  markersRef.current = markersRef.current.filter(
                    marker => marker.getTitle() !== "Selected Location"
                  );
                }
                
                const marker = new google.maps.Marker({
                  position: { lat, lng },
                  map,
                  title: "Selected Location",
                  icon: {
                    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
                      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00829b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
                    ),
                    scaledSize: new google.maps.Size(36, 36),
                  },
                  animation: google.maps.Animation.DROP,
                  zIndex: 10
                });
                
                markersRef.current.push(marker);
                onLocationSelect(lat, lng, address);
              }
            });
          }
        }
      } catch (error) {
        console.error("Error loading Google Maps", error);
        setError("Failed to load map. Please check your connection and try again.");
      }
    };
    
    initMap();
  }, []);
  
  // Update markers when crimes change
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;
    
    // Clear existing crime markers
    markersRef.current.forEach(marker => {
      if (marker.getTitle() !== "Selected Location") {
        marker.setMap(null);
      }
    });
    markersRef.current = markersRef.current.filter(
      marker => marker.getTitle() === "Selected Location"
    );
    
    // Add new markers for each crime
    crimes.forEach((crime) => {
      // Skip if no location data
      if (!crime.location) return;
      
      // Create a custom marker element
      const markerDiv = document.createElement("div");
      markerDiv.className = "crime-pin";
      markerDiv.innerHTML = "";
      
      const marker = new google.maps.Marker({
        position: { lat: crime.location.lat, lng: crime.location.lng },
        map: mapInstanceRef.current,
        title: crime.type,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#e11d48" stroke="#ffffff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6" fill="white" stroke="none"/><circle cx="12" cy="12" r="4" fill="#e11d48" stroke="none"/></svg>`
          ),
          scaledSize: new google.maps.Size(32, 32),
        },
      });
      
      // Add info window with crime details
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold">${crime.type}</h3>
            <p>${crime.description}</p>
            <p class="text-sm text-gray-500">Date: ${crime.date} at ${crime.time}</p>
            <p class="text-sm text-gray-500">Status: ${crime.status}</p>
          </div>
        `,
        maxWidth: 300
      });
      
      marker.addListener("click", () => {
        infoWindow.open({
          map: mapInstanceRef.current,
          anchor: marker
        });
      });
      
      markersRef.current.push(marker);
    });
  }, [crimes, mapLoaded]);
  
  // Update map center and marker when selectedLocation changes
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !selectedLocation) return;
    
    // Center map on selected location
    mapInstanceRef.current.panTo(selectedLocation);
    
    // Update or create selected location marker
    const existingMarker = markersRef.current.find(marker => marker.getTitle() === "Selected Location");
    
    if (existingMarker) {
      existingMarker.setPosition(selectedLocation);
    } else if (interactive) {
      const marker = new google.maps.Marker({
        position: selectedLocation,
        map: mapInstanceRef.current,
        title: "Selected Location",
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00829b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
          ),
          scaledSize: new google.maps.Size(36, 36),
        },
        animation: google.maps.Animation.DROP,
        zIndex: 10
      });
      
      markersRef.current.push(marker);
    }
  }, [selectedLocation, mapLoaded, interactive]);
  
  return (
    <div className="relative">
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-100 text-red-800 p-4 z-10 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      <div className="map-container" ref={mapRef} />
    </div>
  );
};

export default Map;

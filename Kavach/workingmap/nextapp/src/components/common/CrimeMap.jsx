import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { format } from 'date-fns';
import ReportModal from '../user/ReportModal';
import CrimeFilters from './CrimeFilters';
import Legend from './Legend';
import { useSocket } from '@/context/SocketContext';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const CrimeMap = () => {
  // Viewport state for the map
  const [viewState, setViewState] = useState({
    latitude: 20.5937, // Default to center of India
    longitude: 78.9629,
    zoom: 4
  });

  // Crime data state
  const [crimes, setCrimes] = useState([]);
  const [filteredCrimes, setFilteredCrimes] = useState([]);
  const [filters, setFilters] = useState({
    crimeType: 'all',
    timeFrame: 'all',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected crime for popup
  const [selectedCrime, setSelectedCrime] = useState(null);
  
  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportLocation, setReportLocation] = useState(null);

  // UI state
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [notification, setNotification] = useState(null);
  
  // Map reference for interactions
  const mapRef = useRef();
  
  // Socket connection for real-time updates
  const { socket } = useSocket();

  // Fetch initial crime data
  useEffect(() => {
    const fetchCrimes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/crime/getAll');
        if (response.data.success) {
          setCrimes(response.data.data);
          setFilteredCrimes(response.data.data);
          if (response.data.data.length > 0) {
            showNotification(`Loaded ${response.data.data.length} crime reports`, 'info');
          } else {
            showNotification('No crime reports found for this area', 'info');
          }
        } else {
          throw new Error(response.data.error || 'Failed to fetch crime data');
        }
      } catch (error) {
        console.error('Error fetching crime data:', error);
        setError('Failed to load crime data. Please try again later.');
        showNotification('Failed to load crime data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCrimes();
  }, []);

  // Listen for real-time crime reports
  useEffect(() => {
    if (!socket) return;

    socket.on('new-crime-report', (newCrime) => {
      showNotification('New crime reported in your area!', 'warning');
      setCrimes(prevCrimes => {
        // Check if crime already exists to avoid duplicates
        if (prevCrimes.some(c => c._id === newCrime._id)) {
          return prevCrimes;
        }
        return [...prevCrimes, newCrime];
      });
      
      // Apply current filters to the updated crime list
      applyFilters([...crimes, newCrime], filters);
    });

    return () => {
      socket.off('new-crime-report');
    };
  }, [socket, crimes, filters]);

  // Add click outside handler to close popup
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if we have a selected crime and if the click is outside a popup or marker
      if (selectedCrime) {
        // Check if the click is not on a popup element or marker
        const isPopupClick = event.target.closest('.mapboxgl-popup');
        const isMarkerClick = event.target.closest('.mapboxgl-marker');
        
        if (!isPopupClick && !isMarkerClick) {
          setSelectedCrime(null);
        }
      }
    }
    
    // Add global document click handler
    document.addEventListener('click', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedCrime]);

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Apply filters to crime data
  const applyFilters = (crimeData, currentFilters) => {
    let filtered = [...crimeData];
    
    // Filter by crime type
    if (currentFilters.crimeType !== 'all') {
      filtered = filtered.filter(crime => crime.type === currentFilters.crimeType);
    }
    
    // Filter by time frame
    if (currentFilters.timeFrame !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch (currentFilters.timeFrame) {
        case 'day':
          cutoffDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case 'week':
          cutoffDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          cutoffDate = null;
      }
      
      if (cutoffDate) {
        filtered = filtered.filter(crime => new Date(crime.timestamp) >= cutoffDate);
      }
    }
    
    setFilteredCrimes(filtered);
    showNotification(`Showing ${filtered.length} crime reports`, 'info');
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(crimes, newFilters);
  };

  // Handle map click for reporting
  const handleMapClick = (event) => {
    // Close any open popup when clicking on the map
    setSelectedCrime(null);
    
    if (event.originalEvent.ctrlKey || event.originalEvent.metaKey) {
      setReportLocation({
        latitude: event.lngLat.lat,
        longitude: event.lngLat.lng
      });
      setShowReportModal(true);
    }
  };

  // Handle report submission
  const handleReportSubmit = async (reportData) => {
    try {
      const response = await axios.post('/api/crime/create', {
        ...reportData,
        location: reportLocation
      });
      
      if (response.data.success) {
        // Close modal after successful submission
        setShowReportModal(false);
        setReportLocation(null);
        
        // Add new crime to the list
        setCrimes(prevCrimes => [...prevCrimes, response.data.data]);
        
        // Apply current filters to include/exclude the new report
        applyFilters([...crimes, response.data.data], filters);
        
        // Show success notification
        showNotification('Crime report submitted successfully! Thank you for keeping your community safe.', 'success');
      } else {
        throw new Error(response.data.error || 'Failed to submit report');
      }
      
    } catch (error) {
      console.error('Error submitting crime report:', error);
      showNotification('Failed to submit report. Please try again.', 'error');
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)]">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-3 text-gray-700 font-medium">Loading crime data...</p>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-30">
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 right-0 px-4 py-3" 
            onClick={() => setError(null)}
          >
            <span className="text-red-500">×</span>
          </button>
        </div>
      )}
      
      {/* Notification */}
      {notification && (
        <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded z-30 shadow-lg transition-all duration-500 ease-in-out
          ${notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-400' : ''}
          ${notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-400' : ''}
          ${notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-400' : ''}
          ${notification.type === 'info' ? 'bg-blue-100 text-blue-800 border border-blue-400' : ''}
        `}>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main map component */}
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        onClick={handleMapClick}
        attributionControl={false}
        doubleClickZoom={false}
      >
        {/* Map controls */}
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        <GeolocateControl 
          position="top-right"
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserLocation={true}
        />
        
        {/* Crime markers */}
        {filteredCrimes.map(crime => (
          <Marker 
            key={crime._id}
            latitude={crime.location.latitude}
            longitude={crime.location.longitude}
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedCrime(crime);
            }}
          >
            <div className="cursor-pointer transform transition-transform hover:scale-125 duration-200">
              <div 
                className={`w-5 h-5 rounded-full ${getCrimeTypeColor(crime.type)} shadow-lg border border-white flex items-center justify-center`}
              >
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75 bg-white"></span>
              </div>
            </div>
          </Marker>
        ))}
        
        {/* Selected crime popup */}
        {selectedCrime && (
          <Popup
            latitude={selectedCrime.location.latitude}
            longitude={selectedCrime.location.longitude}
            anchor="bottom"
            onClose={() => setSelectedCrime(null)}
            closeOnClick={false}
            className="z-10"
            maxWidth="300px"
          >
            <div className="p-2">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${getCrimeTypeColor(selectedCrime.type)}`}></div>
                <h3 className="font-bold text-lg capitalize">{selectedCrime.type}</h3>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">Reported:</span> {format(new Date(selectedCrime.timestamp), 'PPp')}
              </p>
              <div className="bg-gray-50 p-2 rounded border border-gray-200 mb-2">
                <p className="text-sm">{selectedCrime.description}</p>
              </div>
              {selectedCrime.media && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Evidence:</p>
                  <img 
                    src={selectedCrime.media} 
                    alt="Crime evidence" 
                    className="max-w-full rounded border border-gray-300 hover:border-blue-500 transition-colors"
                    onClick={() => window.open(selectedCrime.media, '_blank')}
                  />
                </div>
              )}
              <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between text-xs">
                <span className="text-gray-500">
                  {selectedCrime.reportedBy?.name || 'Anonymous'}
                </span>
                <span className="text-gray-500">
                  Status: <span className="font-semibold capitalize">{selectedCrime.status || 'reported'}</span>
                </span>
              </div>
            </div>
          </Popup>
        )}
      </Map>
      
      {/* Crime filter controls */}
      <div className="absolute top-4 left-4 z-10">
        <div className={`bg-white rounded-lg shadow-lg transition-all duration-300 ${isFilterOpen ? 'p-4' : 'p-2'}`}>
          <div className="flex justify-between items-center">
            {isFilterOpen ? (
              <h3 className="text-lg font-semibold">Filter Crime Data</h3>
            ) : null}
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="ml-2 p-1 rounded-full hover:bg-gray-100"
            >
              {isFilterOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              )}
            </button>
          </div>
          
          {isFilterOpen && (
            <CrimeFilters onFilterChange={handleFilterChange} currentFilters={filters} />
          )}
        </div>
      </div>
      
      {/* Map legend */}
      <div className="absolute bottom-8 left-4 z-10">
        <div className={`transition-all duration-300 ${isLegendOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <Legend />
        </div>
        <button 
          onClick={() => setIsLegendOpen(!isLegendOpen)}
          className="absolute -top-4 -right-4 bg-white p-1 rounded-full shadow hover:bg-gray-100"
        >
          {isLegendOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Report crime button */}
      <button
        className="absolute bottom-8 right-8 z-10 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center transform transition hover:scale-105 duration-200"
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setReportLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                });
                setShowReportModal(true);
              },
              (error) => {
                console.error('Error getting location:', error);
                showNotification('Could not get your location. Ctrl+Click on the map to report a crime at a specific location.', 'warning');
              }
            );
          } else {
            showNotification('Geolocation is not supported by your browser. Ctrl+Click on the map to report a crime.', 'warning');
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Report Crime
      </button>
      
      {/* Instructions tooltip */}
      <div className="absolute top-4 right-24 z-10 bg-white p-3 rounded-lg shadow-lg text-sm max-w-xs animate-pulse hover:animate-none">
        <p><strong>Tip:</strong> Ctrl+Click (or ⌘+Click) anywhere on the map to report a crime at that specific location.</p>
      </div>
      
      {/* Crime count badge */}
      <div className="absolute top-20 right-4 z-10 bg-white px-3 py-1 rounded-full shadow-md text-sm">
        <span className="font-semibold">{filteredCrimes.length}</span> crimes shown
      </div>
      
      {/* Report crime modal */}
      {showReportModal && (
        <ReportModal
          location={reportLocation}
          onClose={() => {
            setShowReportModal(false);
            setReportLocation(null);
          }}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
};

// Helper function to get color based on crime type
const getCrimeTypeColor = (type) => {
  const colors = {
    'theft': 'bg-yellow-500',
    'assault': 'bg-red-500',
    'vandalism': 'bg-blue-500',
    'fraud': 'bg-purple-500',
    'burglary': 'bg-orange-500',
    'other': 'bg-gray-500',
  };
  
  return colors[type?.toLowerCase()] || 'bg-gray-500';
};

export default CrimeMap;
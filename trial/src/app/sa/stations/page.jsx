'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiSearch, FiPlusCircle, FiMapPin, FiUser, FiPhone, FiMail, FiEdit, FiTrash2, FiFilter, FiRefreshCw } from 'react-icons/fi';
import Button from '@/components/common/Button';

export default function PoliceStationsPage() {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [districts, setDistricts] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const router = useRouter();

  // Fetch police stations
  const fetchStations = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/sa/stations');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch police stations');
      }
      
      setStations(data.stations);
      setFilteredStations(data.stations);
      
      // Extract unique districts
      const uniqueDistricts = [...new Set(data.stations.map(station => station.district))].sort();
      setDistricts(uniqueDistricts);
    } catch (err) {
      console.error('Error fetching stations:', err);
      setError(err.message || 'Failed to load police stations.');
      toast.error('Error loading stations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...stations];
    
    // Filter by district
    if (filterDistrict !== 'all') {
      result = result.filter(station => station.district === filterDistrict);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(station => 
        station.name.toLowerCase().includes(query) || 
        station.address.toLowerCase().includes(query) || 
        station.district.toLowerCase().includes(query) ||
        (station.email && station.email.toLowerCase().includes(query)) ||
        (station.phone && station.phone.includes(query))
      );
    }
    
    setFilteredStations(result);
  }, [filterDistrict, searchQuery, stations]);

  const handleOpenDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  const handleDeleteStation = async () => {
    if (!deleteId) return;
    
    try {
      const response = await fetch(`/api/sa/stations/${deleteId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete station');
      }
      
      // Remove the station from the state
      setStations(prev => prev.filter(station => station.id !== deleteId));
      setFilteredStations(prev => prev.filter(station => station.id !== deleteId));
      
      toast.success('Police station deleted successfully');
      handleCloseDeleteModal();
    } catch (err) {
      console.error('Error deleting station:', err);
      toast.error(err.message || 'Failed to delete station');
    }
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Police Stations</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage all police stations in the system
          </p>
        </div>
        
        <Button
          href="/sa/stations/new"
          variant="primary"
          className="mt-4 md:mt-0"
        >
          <FiPlusCircle className="mr-2" />
          Add New Station
        </Button>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Search stations by name, district, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            
            <button
              onClick={fetchStations}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Refresh"
            >
              <FiRefreshCw className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Error state */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <button
            onClick={fetchStations}
            className="mt-2 text-sm font-medium text-danger-600 hover:text-danger-500 underline"
          >
            Try again
          </button>
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading police stations...</p>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && filteredStations.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="inline-block p-3 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <FiMapPin className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No police stations found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || filterDistrict !== 'all' 
              ? 'Try adjusting your search or filter to find what you\'re looking for' 
              : 'Start by adding a new police station to the system'}
          </p>
          {searchQuery || filterDistrict !== 'all' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterDistrict('all');
              }}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Clear filters
            </button>
          ) : (
            <Button
              href="/sa/stations/new"
              variant="primary"
            >
              <FiPlusCircle className="mr-2" />
              Add New Station
            </Button>
          )}
        </div>
      )}
      
      {/* Station list */}
      {!loading && filteredStations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Station
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    District
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStations.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                          <FiMapPin className="h-5 w-5 text-primary-600 dark:text-primary-300" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{station.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{station.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{station.district}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {station.phone && (
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <FiPhone className="mr-1 h-4 w-4" />
                            <span>{station.phone}</span>
                          </div>
                        )}
                        {station.email && (
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <FiMail className="mr-1 h-4 w-4" />
                            <span>{station.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        station.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {station.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/sa/stations/${station.id}`}
                          className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400"
                        >
                          View
                        </Link>
                        <Link
                          href={`/sa/stations/${station.id}/edit`}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                          <FiEdit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenDeleteModal(station.id)}
                          className="text-danger-600 hover:text-danger-900 dark:hover:text-danger-400"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-danger-100 dark:bg-danger-900 sm:mx-0 sm:h-10 sm:w-10">
                    <FiTrash2 className="h-6 w-6 text-danger-600 dark:text-danger-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Delete Police Station
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this police station? All data associated with this station will be permanently removed. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-danger-600 text-base font-medium text-white hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteStation}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

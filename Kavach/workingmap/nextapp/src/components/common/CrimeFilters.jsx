import React from 'react';

const CrimeFilters = ({ onFilterChange, currentFilters }) => {
  const crimeTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'theft', label: 'Theft' },
    { id: 'assault', label: 'Assault' },
    { id: 'vandalism', label: 'Vandalism' },
    { id: 'fraud', label: 'Fraud' },
    { id: 'burglary', label: 'Burglary' },
    { id: 'other', label: 'Other' },
  ];

  const timeFrames = [
    { id: 'all', label: 'All Time' },
    { id: 'day', label: 'Last 24 Hours' },
    { id: 'week', label: 'Last 7 Days' },
    { id: 'month', label: 'Last 30 Days' },
  ];

  const handleCrimeTypeChange = (e) => {
    onFilterChange({
      ...currentFilters,
      crimeType: e.target.value,
    });
  };

  const handleTimeFrameChange = (e) => {
    onFilterChange({
      ...currentFilters,
      timeFrame: e.target.value,
    });
  };

  // Direct filtering by clicking buttons
  const handleQuickFilter = (type) => {
    onFilterChange({
      ...currentFilters,
      crimeType: type,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Crime Type
        </label>
        <select
          value={currentFilters.crimeType}
          onChange={handleCrimeTypeChange}
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {crimeTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
        
        {/* Quick filter buttons */}
        <div className="flex flex-wrap gap-1 mt-2">
          {crimeTypes.slice(1).map(type => (
            <button
              key={type.id}
              onClick={() => handleQuickFilter(type.id)}
              className={`px-2 py-1 text-xs rounded-full shadow-sm transition-colors ${
                currentFilters.crimeType === type.id 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time Frame
        </label>
        <select
          value={currentFilters.timeFrame}
          onChange={handleTimeFrameChange}
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {timeFrames.map(time => (
            <option key={time.id} value={time.id}>
              {time.label}
            </option>
          ))}
        </select>
      </div>

      {currentFilters.crimeType !== 'all' || currentFilters.timeFrame !== 'all' ? (
        <button
          onClick={() => onFilterChange({ crimeType: 'all', timeFrame: 'all' })}
          className="w-full mt-2 flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Clear All Filters
        </button>
      ) : null}
    </div>
  );
};

export default CrimeFilters;
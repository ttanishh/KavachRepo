'use client';

import React from 'react';

export function StateMap({ states = [], selectedState = null, onSelectState }) {
  return (
    <div className="w-full h-full bg-gray-100 rounded-lg p-4 flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-medium mb-2">Interactive Map</p>
        <p className="text-sm text-gray-500 mb-4">
          Map showing {states.length} states
          {selectedState && ` (Selected: ${states.find(s => s.id === selectedState)?.name})`}
        </p>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          {states.map(state => (
            <button
              key={state.id}
              onClick={() => onSelectState(state.id)}
              className={`px-3 py-2 text-sm rounded-md ${
                selectedState === state.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {state.name}
            </button>
          ))}
        </div>
        
        <p className="text-xs text-gray-400 mt-4">
          (Implement actual map library like Leaflet or Mapbox for production)
        </p>
      </div>
    </div>
  );
}

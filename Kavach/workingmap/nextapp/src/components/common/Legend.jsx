import React from 'react';

const Legend = () => {
  const crimeTypes = [
    { id: 'theft', label: 'Theft', color: 'bg-yellow-500' },
    { id: 'assault', label: 'Assault', color: 'bg-red-500' },
    { id: 'vandalism', label: 'Vandalism', color: 'bg-blue-500' },
    { id: 'fraud', label: 'Fraud', color: 'bg-purple-500' },
    { id: 'burglary', label: 'Burglary', color: 'bg-orange-500' },
    { id: 'other', label: 'Other', color: 'bg-gray-500' },
  ];

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-90 border border-gray-200">
      <h3 className="font-semibold text-sm mb-2 text-gray-800">Crime Types</h3>
      <div className="space-y-2">
        {crimeTypes.map(type => (
          <div key={type.id} className="flex items-center group">
            <div className={`w-4 h-4 rounded-full ${type.color} mr-2 shadow-sm group-hover:scale-125 transition-transform duration-200`}></div>
            <span className="text-xs text-gray-700 group-hover:font-medium transition-all">{type.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
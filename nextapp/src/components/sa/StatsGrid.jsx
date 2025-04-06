import React from 'react';

export function StatsGrid({ className = '' }) {
  // Sample stats
  const stats = [
    { id: 1, name: 'Average Resolution Time', value: '3.2 days', change: '+5%', changeType: 'negative' },
    { id: 2, name: 'Emergency Response Rate', value: '98.7%', change: '+1.2%', changeType: 'positive' },
    { id: 3, name: 'User Satisfaction Score', value: '4.8/5', change: '+0.3', changeType: 'positive' },
    { id: 4, name: 'Active Police Officers', value: '1,248', change: '+15', changeType: 'positive' },
  ];
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat) => (
        <div key={stat.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">{stat.name}</p>
          <p className="text-2xl font-bold mt-1">{stat.value}</p>
          <p className={`text-xs font-medium mt-1 ${
            stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {stat.change} from previous period
          </p>
        </div>
      ))}
    </div>
  );
}

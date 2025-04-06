'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value} reports
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const HeatmapChart = ({ 
  data = [], 
  title = 'Crime Reports by Category', 
  dataKey = 'district', 
  stacked = true,
  colors = ['#0ea5e9', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981'],
  className = '',
  height = 400
}) => {
  // If no data, show placeholder
  if (data.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
        <div 
          className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg"
          style={{ height: `${height}px` }}
        >
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  // Extract all categories for the bars
  const categories = Object.keys(data[0]).filter(key => key !== dataKey);
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
      
      <div style={{ width: '100%', height: `${height}px` }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={dataKey} 
              angle={-45} 
              textAnchor="end" 
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {categories.map((category, index) => (
              <Bar 
                key={category}
                dataKey={category} 
                stackId={stacked ? "stack" : index}
                name={category.charAt(0).toUpperCase() + category.slice(1)} 
                fill={colors[index % colors.length]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HeatmapChart;

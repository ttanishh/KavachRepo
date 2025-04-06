import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  variant = 'primary', 
  className = '' 
}) => {
  const bgColors = {
    primary: 'bg-primary-100 dark:bg-primary-900',
    secondary: 'bg-secondary-100 dark:bg-secondary-900',
    success: 'bg-green-100 dark:bg-green-900',
    danger: 'bg-red-100 dark:bg-red-900',
    warning: 'bg-yellow-100 dark:bg-yellow-900',
    info: 'bg-blue-100 dark:bg-blue-900',
  };
  
  const iconColors = {
    primary: 'text-primary-600 dark:text-primary-400',
    secondary: 'text-secondary-600 dark:text-secondary-400',
    success: 'text-green-600 dark:text-green-400',
    danger: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
  };
  
  return (
    <div className={`rounded-lg p-5 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          
          {change !== undefined && (
            <div className={`mt-2 text-sm font-medium ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {change >= 0 ? '+' : ''}{change}%
              <span className="text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`rounded-full p-3 ${bgColors[variant]}`}>
            <span className={iconColors[variant]}>
              {icon}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;

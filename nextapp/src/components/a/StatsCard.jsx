// components/a/StatsCard.jsx
import React from 'react';
import { Card, CardContent } from '../common/Card';

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  variant = 'default',
  className = '',
  ...props
}) {
  const variants = {
    default: 'bg-surface-50',
    primary: 'bg-primary-50',
    secondary: 'bg-secondary-50',
    success: 'bg-success-50',
    warning: 'bg-warning-50',
    error: 'bg-error-50',
  };
  
  const trendColors = {
    up: 'text-success-500',
    down: 'text-error-500',
    neutral: 'text-surface-500',
  };
  
  const trendIcons = {
    up: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
      </svg>
    ),
    down: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 10.586 3.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
      </svg>
    ),
    neutral: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <Card 
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-surface-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          {icon && (
            <div className="p-2 rounded-full bg-white bg-opacity-50">
              {icon}
            </div>
          )}
        </div>
        
        {(description || trend) && (
          <div className="mt-4 flex items-center">
            {trend && (
              <div className={`flex items-center mr-2 ${trendColors[trend]}`}>
                {trendIcons[trend]}
                <span className="ml-1 text-sm font-medium">{trendValue}</span>
              </div>
            )}
            {description && (
              <div className="text-sm text-surface-500">{description}</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
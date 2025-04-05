// components/sa/SystemStatsCard.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';

export function SystemStatsCard({
  stats = {},
  className = '',
  ...props
}) {
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-surface-500">Uptime</h3>
            <p className="text-lg font-semibold mt-1">
              {stats.uptime || '99.9%'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-surface-500">Response Time</h3>
            <p className="text-lg font-semibold mt-1">
              {stats.responseTime || '245ms'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-surface-500">Active Users</h3>
            <p className="text-lg font-semibold mt-1">
              {stats.activeUsers || '1,254'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-surface-500">Disk Usage</h3>
            <p className="text-lg font-semibold mt-1">
              {stats.diskUsage || '42%'}
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-surface-500 mb-2">Storage Usage</h3>
          <div className="w-full h-2 bg-surface-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full" 
              style={{ width: stats.storageUsagePercent || '42%' }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-surface-500">
            <span>
              {stats.storageUsed || '4.2'} GB used
            </span>
            <span>
              {stats.storageTotal || '10'} GB total
            </span>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-surface-500 mb-2">System Notifications</h3>
          {(stats.notifications || []).length > 0 ? (
            <ul className="space-y-2">
              {(stats.notifications || []).map((notification, index) => (
                <li key={index} className="text-sm p-2 bg-surface-100 rounded-md">
                  <div className="flex items-start">
                    {notification.type === 'error' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    ) : notification.type === 'warning' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    )}
                    <div>
                      <p className="text-surface-700">{notification.message}</p>
                      <p className="text-xs text-surface-500 mt-1">{notification.timestamp}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-surface-500">No system notifications</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
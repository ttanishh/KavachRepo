'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';

export function DateRangePicker({ value, onChange, className = '' }) {
  const [startDate, setStartDate] = useState(value?.start || '');
  const [endDate, setEndDate] = useState(value?.end || '');
  
  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      setStartDate(value.start || '');
      setEndDate(value.end || '');
    }
  }, [value]);
  
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    
    if (onChange) {
      onChange({ start: newStartDate, end: endDate });
    }
  };
  
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    
    if (onChange) {
      onChange({ start: startDate, end: newEndDate });
    }
  };
  
  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    
    if (onChange) {
      onChange({ start: null, end: null });
    }
  };
  
  // Preset date handlers
  const handleLastWeek = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    
    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(end));
    
    if (onChange) {
      onChange({ 
        start: formatDateForInput(start), 
        end: formatDateForInput(end) 
      });
    }
  };
  
  const handleLastMonth = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    
    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(end));
    
    if (onChange) {
      onChange({ 
        start: formatDateForInput(start), 
        end: formatDateForInput(end) 
      });
    }
  };
  
  const handleLast3Months = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    
    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(end));
    
    if (onChange) {
      onChange({ 
        start: formatDateForInput(start), 
        end: formatDateForInput(end) 
      });
    }
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label htmlFor="startDate" className="block text-sm font-medium text-surface-700 mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            className="w-full rounded-md border-surface-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            value={startDate}
            onChange={handleStartDateChange}
            max={endDate || undefined}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="endDate" className="block text-sm font-medium text-surface-700 mb-1">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            className="w-full rounded-md border-surface-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate || undefined}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={handleLastWeek}>
          Last Week
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleLastMonth}>
          Last Month
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleLast3Months}>
          Last 3 Months
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleClear} className="ml-auto">
          Clear
        </Button>
      </div>
    </div>
  );
}

// Helper function to format date for input field
function formatDateForInput(date) {
  if (!date) return '';
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

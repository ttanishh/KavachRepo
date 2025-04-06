import React from 'react';
import { cn } from '@/lib/utils';

export function Select({
  className = '',
  options = [],
  placeholder,
  label,
  error,
  helperText,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-surface-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={cn(
          "block w-full rounded-md border-surface-300 bg-white px-3 py-2 text-surface-700 shadow-sm transition-colors focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed sm:text-sm",
          error && "border-error-300 focus:border-error-500 focus:ring-error-500",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled={props.required}>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-error-600' : 'text-surface-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
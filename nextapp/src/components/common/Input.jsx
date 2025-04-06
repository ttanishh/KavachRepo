// components/common/Input.jsx
import React from 'react';
import { cn } from '@/lib/utils';

export function Input({
  className = '',
  type = 'text',
  error,
  label,
  helperText,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "block w-full rounded-md border bg-white px-3 py-2 text-surface-700 shadow-sm transition-colors sm:text-sm",
          error 
            ? "border-error-300 focus:border-error-500 focus:ring-error-500" 
            : "border-surface-200 focus:border-primary-500 focus:ring-primary-500",
          className
        )}
        {...props}
      />
      {(error || helperText) && (
        <p className={cn(
          "mt-1 text-sm",
          error ? "text-error-600" : "text-surface-500"
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
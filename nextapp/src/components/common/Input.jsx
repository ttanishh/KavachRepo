// components/common/Input.jsx
import React from 'react';

export function Input({
  label,
  id,
  error,
  helperText,
  type = 'text',
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`
          w-full px-3 py-2 bg-surface-50 border rounded-md
          ${error ? 'border-error-500 focus:ring-error-500' : 'border-surface-300 focus:ring-primary-500'}
          focus:outline-none focus:ring-2 focus:ring-opacity-20
          disabled:bg-surface-100 disabled:text-surface-500
          ${className}
        `}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-description` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-error-500 mt-1">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${id}-description`} className="text-xs text-surface-500 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}
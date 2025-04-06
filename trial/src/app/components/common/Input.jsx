import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
    </div>
  );
}

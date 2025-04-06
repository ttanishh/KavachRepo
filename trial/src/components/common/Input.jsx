import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  id,
  placeholder,
  error,
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

// components/common/Badge.jsx
import React from 'react';

export function Badge({
  children,
  variant = 'default',
  status,
  className = '',
  ...props
}) {
  const variants = {
    default: 'bg-surface-100 text-surface-700',
    primary: 'bg-primary-100 text-primary-700',
    secondary: 'bg-secondary-100 text-secondary-700',
    success: 'bg-success-50 text-success-500', 
    warning: 'bg-warning-50 text-warning-500',
    error: 'bg-error-50 text-error-500',
    info: 'bg-info-50 text-info-500',
  };
  
  const statusVariants = {
    new: 'bg-info-50 text-info-500',
    in_review: 'bg-secondary-100 text-secondary-700',
    assigned: 'bg-warning-50 text-warning-500',
    resolved: 'bg-success-50 text-success-500',
    closed: 'bg-surface-200 text-surface-700',
  };
  
  const variantClass = status ? statusVariants[status] : variants[variant];
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
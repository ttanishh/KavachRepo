// components/common/Card.jsx
import React from 'react';

export function Card({
  children,
  variant = 'default',
  className = '',
  ...props
}) {
  const variantClasses = {
    default: 'bg-surface-50 border border-surface-200',
    elevated: 'bg-surface-50 shadow-md',
    outline: 'bg-transparent border border-surface-300',
  };
  
  return (
    <div 
      className={`rounded-lg overflow-hidden ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`p-4 border-b border-surface-200 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={`text-lg font-semibold text-surface-900 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`p-4 border-t border-surface-200 ${className}`} {...props}>
      {children}
    </div>
  );
}
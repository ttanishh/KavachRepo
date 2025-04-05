// components/common/Button.jsx
import React from 'react';
import Link from 'next/link';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  href,
  className = '',
  ...props
}) {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
    secondary: "bg-surface-50 text-primary-500 border border-primary-500 hover:bg-primary-50",
    outline: "bg-transparent text-surface-700 border border-surface-300 hover:bg-surface-100",
    ghost: "bg-transparent text-surface-700 hover:bg-surface-100",
    destructive: "bg-error-500 text-white hover:bg-error-600",
  };
  
  const sizes = {
    sm: "text-xs px-3 py-1.5 h-8",
    md: "text-sm px-4 py-2 h-10",
    lg: "text-base px-6 py-2.5 h-12",
  };
  
  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    className
  ].join(" ");
  
  const Comp = href ? Link : "button";
  
  return (
    <Comp
      href={href}
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </Comp>
  );
}
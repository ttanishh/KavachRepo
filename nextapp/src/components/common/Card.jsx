// components/common/Card.jsx
import React from 'react';
import { cn } from '@/lib/utils';

function Card({ children, className = '', ...props }) {
  return (
    <div className={cn(
      "bg-white rounded-lg border border-surface-200 shadow-card transition-shadow hover:shadow-elevated",
      className
    )} {...props}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={cn("px-6 py-4 border-b border-surface-200", className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={cn("text-lg font-medium text-surface-800", className)} {...props}>
      {children}
    </h3>
  );
}

function CardContent({ children, className = '', ...props }) {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-surface-500", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
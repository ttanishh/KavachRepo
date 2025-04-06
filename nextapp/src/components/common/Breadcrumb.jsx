// components/common/Breadcrumb.jsx
import React from 'react';
import Link from 'next/link';

export function Breadcrumb({
  items = [],
  className = '',
  ...props
}) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb" {...props}>
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-surface-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
              
              {isLast ? (
                <span className="ml-1 text-sm font-medium text-surface-700">
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.href} 
                  className={`ml-1 text-sm font-medium text-surface-500 hover:text-primary-500`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
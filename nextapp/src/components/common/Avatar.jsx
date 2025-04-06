// components/common/Avatar.jsx
import React from 'react';
import Image from 'next/image';

export function Avatar({
  src,
  alt = '',
  name,
  size = 'md',
  className = '',
  ...props
}) {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };
  
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  return (
    <div 
      className={`relative inline-flex items-center justify-center rounded-full bg-surface-200 text-surface-700 overflow-hidden ${sizes[size]} ${className}`}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      ) : (
        <span className="font-medium">{name ? getInitials(name) : 'U'}</span>
      )}
    </div>
  );
}
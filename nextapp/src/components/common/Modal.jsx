// components/common/Modal.jsx
import React, { useEffect, useRef } from 'react';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
  ...props
}) {
  const modalRef = useRef(null);
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[calc(100vw-2rem)]',
  };
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50" onClick={onClose}>
      <div 
        ref={modalRef}
        className={`${sizes[size]} w-full bg-surface-50 rounded-lg shadow-lg ${className}`}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        <div className="p-4 border-b border-surface-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
            <button 
              type="button"
              onClick={onClose}
              className="text-surface-500 hover:text-surface-700 focus:outline-none"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {children}
        </div>
        
        {footer && (
          <div className="p-4 border-t border-surface-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

const TabsContext = createContext({
  value: '',
  setValue: () => {},
});

export function Tabs({ defaultValue, value, onValueChange, children, className = '', ...props }) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  
  const currentValue = value !== undefined ? value : internalValue;
  const handleValueChange = onValueChange || setInternalValue;
  
  return (
    <TabsContext.Provider value={{ value: currentValue, setValue: handleValueChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = '', ...props }) {
  return (
    <div className={cn("flex flex-wrap gap-2 border-b border-surface-200", className)} {...props}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = '', ...props }) {
  const { value: selectedValue, setValue } = useContext(TabsContext);
  const isSelected = selectedValue === value;
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      data-state={isSelected ? "active" : "inactive"}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors relative",
        isSelected 
          ? "text-primary-600 border-b-2 border-primary-600 -mb-px" 
          : "text-surface-600 hover:text-surface-900 hover:bg-surface-50",
        className
      )}
      onClick={() => setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = '', ...props }) {
  const { value: selectedValue } = useContext(TabsContext);
  const isSelected = selectedValue === value;
  
  if (!isSelected) return null;
  
  return (
    <div
      role="tabpanel"
      data-state={isSelected ? "active" : "inactive"}
      className={cn("", className)}
      {...props}
    >
      {children}
    </div>
  );
}
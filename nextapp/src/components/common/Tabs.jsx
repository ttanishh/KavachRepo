// components/common/Tabs.jsx
import React, { useState } from 'react';

export function Tabs({
  tabs = [],
  defaultTab = 0,
  onChange,
  className = '',
  ...props
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index);
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      <div className="border-b border-surface-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium transition-colors
                ${activeTab === index 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-surface-600 hover:text-surface-700 hover:border-surface-300'}
              `}
              onClick={() => handleTabClick(index)}
              aria-current={activeTab === index ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div>
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}
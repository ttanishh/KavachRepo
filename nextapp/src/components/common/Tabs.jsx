// Tabs Components for direct use in auth/login/page.jsx
function Tabs({ children, className = "" }) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}

function TabsList({ children, className = "" }) {
  return (
    <div className={`grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-lg ${className}`}>
      {children}
    </div>
  );
}

function TabsTrigger({ children, value, currentValue, onValueChange, className = "" }) {
  const isActive = value === currentValue;
  
  return (
    <button
      type="button"
      className={`py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-white shadow-sm text-blue-600'
          : 'text-gray-500 hover:text-gray-700'
      } ${className}`}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
}

function TabsContent({ children, value, currentValue, className = "" }) {
  if (value !== currentValue) return null;
  return <div className={className}>{children}</div>;
}
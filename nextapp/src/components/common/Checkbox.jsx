// Custom Checkbox Component
function Checkbox({ 
    name, 
    label, 
    checked, 
    onChange, 
    error, 
    required = false, 
    disabled = false 
  }) {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
              error ? 'border-red-300' : ''
            } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
        </div>
        
        <div className="ml-2">
          {label && (
            <label htmlFor={name} className={`text-sm ${error ? 'text-red-600' : 'text-gray-700'}`}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          
          {error && typeof error === 'string' && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    );
  }
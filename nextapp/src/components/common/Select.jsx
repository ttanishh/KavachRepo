// Select component to be used inline within your files
function Select({ 
    name, 
    label, 
    options, 
    value, 
    onChange, 
    error, 
    required = false, 
    disabled = false, 
    className = "" 
  }) {
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={name} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`block w-full px-3 py-2 bg-white border ${
            error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${className}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
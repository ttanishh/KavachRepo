// components/common/MediaUploader.jsx
import React, { useState, useRef } from 'react';
import Image from 'next/image';

export function MediaUploader({
  multiple = false,
  accept = 'image/*',
  maxSize = 5242880, // 5MB
  onChange,
  value = [],
  className = '',
  ...props
}) {
  const [files, setFiles] = useState(value);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setError('');
    
    // Validate file size
    const invalidFiles = selectedFiles.filter(file => file.size > maxSize);
    if (invalidFiles.length > 0) {
      setError(`Some files exceed the maximum size of ${maxSize / 1024 / 1024}MB`);
      return;
    }
    
    const newFiles = multiple ? [...files, ...selectedFiles] : selectedFiles;
    setFiles(newFiles);
    
    if (onChange) {
      onChange(newFiles);
    }
  };
  
  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    if (onChange) {
      onChange(newFiles);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      <div className="flex items-center justify-center w-full">
        <label 
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-surface-50 border-surface-300 hover:bg-surface-100"
          onClick={triggerFileInput}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-surface-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mb-2 text-sm text-surface-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-surface-500">
              {multiple ? 'Upload multiple files' : 'Upload one file'} (max {maxSize / 1024 / 1024}MB)
            </p>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
          />
        </label>
      </div>
      
      {error && <p className="text-xs text-error-500">{error}</p>}
      
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="relative h-24 w-full rounded-md overflow-hidden bg-surface-200">
                {file.type?.startsWith('image/') ? (
                  <Image
                    src={file instanceof File ? URL.createObjectURL(file) : file.url || file}
                    alt={`Uploaded file ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="absolute top-1 right-1 bg-surface-900/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
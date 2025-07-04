import React, { useState } from 'react';

const FileUpload = ({ onFileSelect, maxSize = 5, acceptedTypes = ['image/*', 'application/pdf'], disabled = false }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setError('');
    
    if (!file) return;

    // Validate file size (convert maxSize from MB to bytes)
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const fileType = file.type;
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return fileType.startsWith(type.replace('/*', ''));
      }
      return type === fileType;
    });

    if (!isValidType) {
      setError(`Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onloadend = () => {
      onFileSelect({
        name: file.name,
        type: file.type,
        size: file.size,
        data: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {acceptedTypes.join(', ')} (Max {maxSize}MB)
            </p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileSelect}
            accept={acceptedTypes.join(',')}
            disabled={disabled}
          />
        </label>
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {preview && (
        <div className="relative w-full h-32">
          <img
            src={preview}
            alt="File preview"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload; 
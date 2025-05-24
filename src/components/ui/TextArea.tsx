import React from 'react';

interface TextAreaProps {
  label?: string;
  id: string;
  className?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

export default function TextArea({
  label,
  id,
  className = '',
  error,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  rows = 4,
  ...props
}: TextAreaProps) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block font-montserrat font-semibold mb-2 text-inkwell-black">
          {label}
          {required && <span className="text-reading-red ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`w-full p-3 border rounded-input font-montserrat text-base
                   focus:outline-none focus:border-story-blue focus:ring-2 focus:ring-story-blue/20
                   ${error ? 'border-reading-red' : 'border-gray-300'}
                   ${disabled ? 'bg-fog cursor-not-allowed' : ''}
                   ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className="mt-1 text-reading-red text-sm">{error}</p>
      )}
    </div>
  );
}

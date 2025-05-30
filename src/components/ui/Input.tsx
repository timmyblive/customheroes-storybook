import React from 'react';

interface InputProps {
  label?: string;
  id: string;
  name?: string;
  type?: string;
  className?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function Input({
  label,
  id,
  name,
  type = 'text',
  className = '',
  error,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  ...props
}: InputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block font-montserrat font-semibold mb-2 text-inkwell-black">
          {label}
          {required && <span className="text-reading-red ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
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

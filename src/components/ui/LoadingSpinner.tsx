import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

/**
 * Loading spinner component for displaying loading states throughout the application
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Loading...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className={`text-center py-6 ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-story-blue border-t-transparent rounded-full animate-spin mx-auto mb-4`}
      ></div>
      {message && <p className="text-charcoal">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;

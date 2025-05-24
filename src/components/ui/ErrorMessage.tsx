import React from 'react';
import Button from './Button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Error message component for displaying errors throughout the application
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`bg-reading-red/10 rounded-md p-6 text-center ${className}`}>
      <div className="w-16 h-16 bg-reading-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <i className="fas fa-exclamation-triangle text-reading-red text-xl"></i>
      </div>
      <h3 className="font-montserrat font-bold text-xl mb-2 text-reading-red">{title}</h3>
      <p className="text-charcoal mb-6">{message}</p>
      {actionText && onAction && (
        <Button onClick={onAction}>{actionText}</Button>
      )}
    </div>
  );
};

export default ErrorMessage;

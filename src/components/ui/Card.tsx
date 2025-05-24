import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'feature' | 'testimonial';
  className?: string;
}

export default function Card({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}: CardProps) {
  const baseStyles = 'bg-paper-white rounded-card';
  
  const variantStyles = {
    default: 'shadow-level-2',
    feature: 'shadow-level-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-level-3 relative overflow-hidden',
    testimonial: 'shadow-level-2 flex flex-col h-full',
  };
  
  const cardStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;
  
  return (
    <div className={cardStyles} {...props}>
      {variant === 'feature' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gradient" />
      )}
      {children}
    </div>
  );
}

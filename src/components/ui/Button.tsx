import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'cta' | 'cta-outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  style?: React.CSSProperties;
  target?: string;
  rel?: string;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  href,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  style,
  target,
  rel,
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-montserrat font-bold inline-flex items-center justify-center rounded-button transition-all duration-300';
  
  const variantStyles = {
    primary: 'adventure-button',
    secondary: 'adventure-button-secondary',
    tertiary: 'bg-transparent text-story-blue hover:bg-blue-50',
    cta: 'bg-paper-white text-story-blue font-bold hover:bg-gray-100 hover:shadow-level-3',
    'cta-outline': 'bg-transparent text-paper-white border-2 border-paper-white hover:bg-white/10 hover:shadow-level-3',
  };
  
  const sizeStyles = {
    sm: 'text-sm py-2 px-4 h-10',
    md: 'text-base py-3 px-8 h-12',
    lg: 'text-lg py-4 px-10 h-14',
  };
  
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  
  if (href && !disabled) {
    return (
      <Link href={href} target={target} rel={rel} className={buttonStyles} style={style} {...props}>
        {children}
      </Link>
    );
  }
  
  return (
    <button 
      className={buttonStyles} 
      style={style}
      onClick={onClick} 
      type={type} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

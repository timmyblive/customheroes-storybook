import React from 'react';

interface OptionCardProps {
  icon?: React.ReactNode;
  imageUrl?: string;
  title: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function OptionCard({
  icon,
  imageUrl,
  title,
  description,
  selected = false,
  onClick,
  className = '',
}: OptionCardProps) {
  return (
    <div
      className={`flex-1 min-w-[150px] border-2 rounded-input p-4 text-center cursor-pointer transition-all flex flex-col items-center
                ${selected ? 'border-story-blue bg-blue-50' : 'border-gray-300 hover:border-story-blue hover:bg-blue-50'}
                ${className}`}
      onClick={onClick}
    >
      {imageUrl ? (
        <div className="relative w-full h-24 mb-2 rounded overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      ) : icon ? (
        <div className="mb-2"> {/* Removed text-story-blue text-2xl */}
          {icon}
        </div>
      ) : null}
      <h4 className="font-montserrat font-semibold text-base mb-1">{title}</h4>
      {description && (
        <p className="text-charcoal text-sm">{description}</p>
      )}
    </div>
  );
}

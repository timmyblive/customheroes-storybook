import React from 'react';

interface Step {
  title: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="relative flex justify-between items-center bg-fog py-4 px-8">
      {/* Background line */}
      <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-300 -translate-y-1/2 z-0"></div>
      
      {/* Progress line */}
      <div 
        className="absolute top-1/2 left-8 h-1 bg-brand-gradient -translate-y-1/2 z-0"
        style={{ width: `${(currentStep - 1) / (steps.length - 1) * 100}%` }}
      ></div>
      
      {/* Step circles */}
      {steps.map((step, index) => {
        // Determine step status
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        
        return (
          <div 
            key={stepNumber}
            className={`
              relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
              ${isCompleted ? 'bg-adventure-green border-adventure-green text-paper-white' : 
                isActive ? 'bg-story-blue border-story-blue text-paper-white' : 
                'bg-paper-white border-2 border-gray-300 text-charcoal'}
            `}
          >
            {isCompleted ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : stepNumber}
          </div>
        );
      })}
    </div>
  );
}

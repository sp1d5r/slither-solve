import React from 'react';

interface HintsSectionProps {
    hints: string[];
    show: boolean;
  }
  
  const HintsSection: React.FC<HintsSectionProps> = ({ hints, show }) => {
    if (!show) return null;
  
    return (
      <div className="mt-4">
        <h4 className="font-medium mb-2">Hints:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {hints.map((hint, idx) => (
            <li key={idx} className="text-gray-600">{hint}</li>
          ))}
        </ul>
      </div>
    );
  };

export { HintsSection };
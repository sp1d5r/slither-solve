import React from 'react';
import { Challenge } from 'shared';

interface ChallengeDescriptionProps {
    challenge: Challenge;
  }
  
const ChallengeDescription: React.FC<ChallengeDescriptionProps> = ({ challenge }) => (
    <div className="prose">
      <h3 className="text-lg font-semibold">Problem</h3>
      <p>{challenge.description || 'No description available'}</p>
      
      <div className="mt-4">
        <h4 className="font-medium">Examples:</h4>
        <div className="space-y-2">
          {challenge.examples.map((example, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded">
              <div><strong>Input:</strong> {example.input}</div>
              <div><strong>Output:</strong> {example.output}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
);

export { ChallengeDescription };
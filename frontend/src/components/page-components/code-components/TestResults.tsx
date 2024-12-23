import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { TestResult } from 'shared';

interface TestResultsProps {
    results: TestResult[];
  }

const TestResults: React.FC<TestResultsProps> = ({ results }) => {
    if (results.length === 0) return null;

    return (
        <div className="space-y-2 h-[10vh] flex-1 overflow-y-scroll">
        <h4 className="font-medium">Test Results:</h4>
        {results.map((result, idx) => (
            <div 
            key={idx}
            className={`p-2 rounded flex items-center gap-2 ${
                result.passed ? 'bg-green-50' : 'bg-red-50'
            }`}
            >
            {result.passed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
                <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span>
                Test {idx + 1}: {result.passed ? 'Passed' : 'Failed'}
                {!result.passed && result.error && ` - ${result.error}`}
                {!result.passed && result.output && ` (Got: ${result.output}, Expected: ${result.expected})`}
            </span>
            </div>
        ))}
        </div>
    );
};
  
export { TestResults };
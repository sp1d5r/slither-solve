import { getStatusIcon } from "./utils";
import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Challenge, TestResult } from 'shared';
import { ChallengeDescription } from './ChallengeDescription';
import { TestResults } from './TestResults';
import { HintsSection } from './HintSection';
import { CodeEditor } from './CodeEditor';
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/card';
import { Alert, AlertDescription } from '../../shadcn/alert';
import { getStatusColor } from './utils';
import { Button } from '../../shadcn/button';

interface CodeChallengeProps {
    onComplete?: (result: { status: 'success' | 'warning' | 'error' | 'skipped'; attempts: number; timeSpent: number }) => void;
    challenge: Challenge;
}
  
const CodeChallenge: React.FC<CodeChallengeProps> = ({ onComplete, challenge }) => {
    const [code, setCode] = useState(challenge.boilerplate);
    const [attempts, setAttempts] = useState(0);
    const [status, setStatus] = useState('initial');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const startTime = useRef(Date.now());
    
    useEffect(() => {
        setCode(challenge.boilerplate);
        setAttempts(0);
        setStatus('initial');
        setFeedback('');
        setTestResults([]);
        startTime.current = Date.now();
    }, [challenge]);
    
    const handleSubmit = async () => {
      setLoading(true);
      setAttempts(prev => prev + 1);
      
      try {
        const response = await fetch('http://localhost:3001/api/code/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            challengeId: challenge.id
          }),
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to execute code');
        }
  
        setTestResults(data.results.testResults);
  
        const newStatus = data.allPassed 
          ? (attempts === 0 ? 'success' : 'warning')
          : attempts >= 2 ? 'error' : status;
  
        setStatus(newStatus);
        
        if (data.allPassed) {
          setFeedback(attempts === 0 ? 'Perfect! First try!' : 'Correct, but took multiple attempts');
          onComplete?.({
            status: newStatus as 'success' | 'warning',
            attempts: attempts + 1,
            timeSpent: Math.floor((Date.now() - startTime.current) / 1000)
          });
        } else if (attempts >= 2) {
          setFeedback('Maximum attempts reached. Try a different challenge.');
          onComplete?.({
            status: 'error',
            attempts: attempts + 1,
            timeSpent: Math.floor((Date.now() - startTime.current) / 1000)
          });
        } else {
          setFeedback(`Some tests failed. ${3 - attempts - 1} attempts remaining.`);
        }
      } catch (error) {
        console.error('Error executing code:', error);
        setFeedback(error instanceof Error ? error.message : 'An error occurred');
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{challenge.title}</CardTitle>
            <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-800">
              {challenge.difficulty}
            </span>
          </div>
        </CardHeader>
        {challenge && <CardContent>
          <div className="space-y-6">
            <ChallengeDescription challenge={challenge} />
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Solution</h3>
              <CodeEditor 
                code={code}
                onChange={setCode}
                isLoading={loading}
              />
            </div>
  
            <TestResults results={testResults} />
  
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Button 
                  onClick={handleSubmit}
                  disabled={loading || status === 'error'}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    'Submit Solution'
                  )}
                </Button>
                <span className="text-sm text-gray-500">
                  Attempts: {attempts}/3
                </span>
              </div>
  
              {feedback && (
                <Alert 
                  className={`${getStatusColor(status)} flex items-center gap-2`}
                >
                  {getStatusIcon(status)}
                  <AlertDescription>{feedback}</AlertDescription>
                </Alert>
              )}
  
              <HintsSection 
                hints={challenge.hints}
                show={attempts > 0 && status !== 'success'}
              />
            </div>
          </div>
        </CardContent>}
      </Card>
    );
  };

  export { CodeChallenge };
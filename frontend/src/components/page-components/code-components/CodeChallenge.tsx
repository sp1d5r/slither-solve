import { getStatusIcon } from "./utils";
import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Challenge, QuestionResult, TestResult } from 'shared';
import { ChallengeDescription } from './ChallengeDescription';
import { TestResults } from './TestResults';
import { HintsSection } from './HintSection';
import { CodeEditor } from './CodeEditor';
import { Alert, AlertDescription } from '../../shadcn/alert';
import { getStatusColor } from './utils';
import { Button } from '../../shadcn/button';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeChallengeProps {
    challenge: Challenge;
    onComplete?: (result: QuestionResult) => void;
}
  
const getResultContent = (attempts: number, isSuccess: boolean) => {
  if (isSuccess) {
    if (attempts === 1) {
      return {
        bgColor: 'bg-gradient-to-r from-green-400 to-emerald-500',
        textColor: 'text-white',
        emoji: '🏆',
        title: 'Perfect First Try!',
        message: 'Absolutely brilliant! You nailed it!'
      };
    } else if (attempts === 2) {
      return {
        bgColor: 'bg-gradient-to-r from-yellow-400 to-amber-500',
        textColor: 'text-white',
        emoji: '⭐',
        title: 'Well Done!',
        message: 'You got it on your second try!'
      };
    } else {
      return {
        bgColor: 'bg-gradient-to-r from-orange-400 to-red-500',
        textColor: 'text-white',
        emoji: '✨',
        title: 'Finally There!',
        message: 'Keep practicing to improve!'
      };
    }
  } else {
    return {
      bgColor: 'bg-gradient-to-r from-red-500 to-purple-500',
      textColor: 'text-white',
      emoji: '😅',
      title: 'Time to Move On',
      message: 'Don\'t worry! Learning from mistakes is part of the journey.'
    };
  }
};

const CodeChallenge: React.FC<CodeChallengeProps> = ({ onComplete, challenge }) => {
    const [code, setCode] = useState(challenge.boilerplate);
    const [attempts, setAttempts] = useState(0);
    const [status, setStatus] = useState('initial');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const startTime = useRef(Date.now());
    const [showResult, setShowResult] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
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
        
        if (data.allPassed || attempts >= 2) {
          setIsSuccess(data.allPassed);
          setShowResult(true);
          setFeedback(data.allPassed 
            ? (attempts === 0 ? 'Perfect! First try!' : 'Correct, but took multiple attempts')
            : 'Maximum attempts reached. Try a different challenge.'
          );
          
          setTimeout(() => {
            setShowResult(false);
            setTimeout(() => {
              onComplete?.({
                questionId: challenge.id,
                status: newStatus as 'success' | 'warning' | 'error' | 'skipped',
                attempts: attempts + 1,
                timeSpent: Math.floor((Date.now() - startTime.current) / 1000),
                code: code,
                testResults: data.results.testResults
              });
            }, 300);
          }, 1500);
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
      <div className="flex flex-col lg:flex-row h-full">
        {/* Left Panel - Question Description */}
        <div className="w-full lg:w-2/5 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl lg:text-2xl font-bold">{challenge.title}</h1>
            <span className="px-2 py-1 text-sm rounded bg-green-100 text-green-800">
              {challenge.difficulty}
            </span>
          </div>
          <ChallengeDescription challenge={challenge} />
          <HintsSection 
            hints={challenge.hints}
            show={attempts > 0 && status !== 'success'}
          />
        </div>

        {/* Right Panel - IDE and Results */}
        <div className="w-full lg:w-3/5 p-4 lg:p-6 flex flex-col">
          <div className="flex-1">
            <CodeEditor 
              code={code}
              onChange={(code) => setCode(code)}
              isLoading={loading}
            />
          </div>

          <div className="mt-6 space-y-4 min-h-[20vh]">
            <div className="flex justify-between items-center">
              <Button 
                onClick={handleSubmit}
                className="bg-green-400 hover:bg-pink-400"
                disabled={loading}
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
              <Alert className={`${getStatusColor(status)} flex items-center gap-2`}>
                {getStatusIcon(status)}
                <AlertDescription>{feedback}</AlertDescription>
              </Alert>
            )}

            <TestResults results={testResults} />
          </div>
        </div>

        {/* Success/Failure Animation Overlay */}
        <AnimatePresence mode="wait">
          {showResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <motion.div
                className={`${getResultContent(attempts, isSuccess).bgColor} p-8 rounded-2xl shadow-xl text-center max-w-md mx-4`}
                initial={{ y: 100, scale: 0.8, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  scale: 1, 
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }
                }}
                exit={{ y: 100, scale: 0.8, opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    rotate: [0, 14, -8, 0]
                  }}
                  transition={{ 
                    duration: 0.6,
                    times: [0, 0.6, 0.8, 1],
                    type: "spring"
                  }}
                  className="text-6xl mb-4"
                >
                  {getResultContent(attempts, isSuccess).emoji}
                </motion.div>
                
                <motion.h2 
                  className={`text-2xl font-bold mb-2 ${getResultContent(attempts, isSuccess).textColor}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {getResultContent(attempts, isSuccess).title}
                </motion.h2>
                
                <motion.p
                  className={`${getResultContent(attempts, isSuccess).textColor} opacity-90`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {getResultContent(attempts, isSuccess).message}
                </motion.p>

                <motion.p
                  className={`${getResultContent(attempts, isSuccess).textColor} text-sm mt-4 opacity-75`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Moving to next challenge...
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  export { CodeChallenge };
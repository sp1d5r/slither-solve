import { Card, CardContent, CardHeader, CardTitle } from '../components/shadcn/card';
import { Button } from '../components/shadcn/button';
import { Alert, AlertDescription } from '../components/shadcn/alert';
import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import Editor, {loader} from "@monaco-editor/react";

interface TestResult {
  passed: boolean;
  output?: string;
  expected?: number;
  error?: string;
}

interface Challenge {
  title: string;
  difficulty: string;
  description: string;
  boilerplate: string;
  examples: Array<{
    input: string;
    output: string;
  }>;
  hints: string[];
}

const pastelTheme = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '#a6c0a6', fontStyle: 'italic' },
    { token: 'keyword', foreground: '#f0a8c0' },  // pastel pink
    { token: 'string', foreground: '#b4e8b4' },   // pastel green
    { token: 'number', foreground: '#c2d8f0' },   // pastel blue
    { token: 'function', foreground: '#f0cfa8' }, // pastel orange
  ],
  colors: {
    'editor.background': '#2a2a2a',               // darker background for contrast
    'editor.foreground': '#e8e8e8',              // light text
    'editor.lineHighlightBackground': '#3a3a3a',  // slightly lighter than background
    'editor.selectionBackground': '#4a4a4a',
    'editorCursor.foreground': '#f0a8c0',        // pastel pink cursor
    'editorLineNumber.foreground': '#888888',
    'editorLineNumber.activeForeground': '#f0a8c0',
  }
};

const CodeChallenge = () => {
  const [code, setCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState('initial'); // 'initial', 'success', 'warning', 'error'
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(true);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Fetch challenge details
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/code/challenges/calculate_sum');
        if (!response.ok) throw new Error('Failed to fetch challenge');
        const data = await response.json();
        setChallenge(data);
        setCode(data.boilerplate);
      } catch (error) {
        console.error('Error fetching challenge:', error);
        setFeedback('Failed to load challenge details');
      } finally {
        setIsLoadingChallenge(false);
      }
    };

    fetchChallenge();
  }, []);

  useEffect(() => {
    loader.init().then(monaco => {
      monaco.editor.defineTheme('pastelTheme', pastelTheme);
    });
  }, []);

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
          challengeId: 'calculate_sum'
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute code');
      }

      setTestResults(data.results.testResults);

      if (data.allPassed) {
        setStatus(attempts === 0 ? 'success' : 'warning');
        setFeedback(attempts === 0 ? 'Perfect! First try!' : 'Correct, but took multiple attempts');
      } else if (attempts >= 2) {
        setStatus('error');
        setFeedback('Maximum attempts reached. Try a different challenge.');
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

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  if (isLoadingChallenge) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load challenge</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{challenge.title}</CardTitle>
            <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-800">
              {challenge.difficulty}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Challenge Description */}
            <div className="prose">
              <h3 className="text-lg font-semibold">Problem</h3>
              <p>{challenge.description}</p>
              
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

            {/* Code Editor */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Solution</h3>
              <div className="rounded-lg overflow-hidden border border-gray-700">
                <Editor
                  height="400px"
                  defaultLanguage="python"
                  theme="pastelTheme"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    tabSize: 4,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    lineNumbers: "on",
                    showUnused: true,
                    folding: true,
                    dragAndDrop: true,
                    formatOnPaste: true,
                    formatOnType: true,
                    padding: { top: 16, bottom: 16 },
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    renderLineHighlight: 'all',
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                  }}
                  onMount={() => setIsEditorReady(true)}
                  loading={
                    <div className="h-[400px] bg-gray-900 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  }
                />
              </div>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Test Results:</h4>
                {testResults.map((result, idx) => (
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
            )}

            {/* Controls and Feedback */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Button 
                  onClick={handleSubmit}
                  disabled={loading || status === 'error' || !code.trim()}
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
                <Alert className={`${getStatusColor()} flex items-center gap-2`}>
                  {getStatusIcon()}
                  <AlertDescription>{feedback}</AlertDescription>
                </Alert>
              )}

              {/* Hints Section */}
              {(attempts > 0 && status !== 'success') && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Hints:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {challenge.hints.map((hint, idx) => (
                      <li key={idx} className="text-gray-600">{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeChallenge;
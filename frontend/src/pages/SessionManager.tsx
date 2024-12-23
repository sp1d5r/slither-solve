import React, { useState, useEffect } from 'react';
import { Card } from '../components/shadcn/card';
import { Button } from '../components/shadcn/button';
import { Loader2 } from 'lucide-react';
import { CodeChallenge } from '../components/page-components/code-components/CodeChallenge';
import { 
  TopicOption, 
  SessionConfig, 
  SessionProgress, 
  Session, 
  QuestionResult,
} from 'shared';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthenticationProvider';
import { useApi } from '../contexts/ApiContext';

// Local state management
interface SessionState {
  session: Session | null;
  currentIndex: number;
}

// Mock data for initial development
const MOCK_TOPICS: TopicOption[] = [
  {
    id: 'variables',
    name: 'Variables',
    description: 'Fundamental Python concepts including variables, types, and basic operations',
    difficulty: 'Easy'
  },
  {
    id: 'if_statements',
    name: 'If Statements',
    description: 'Control flow using conditional statements, comparison operators, and logical operators',
    difficulty: 'Easy'
  },
  {
    id: 'arrays-lists',
    name: 'Arrays & Lists',
    description: 'Working with Python lists, list comprehension, and basic algorithms',
    difficulty: 'Medium'
  },
  {
    id: 'functions',
    name: 'Functions',
    description: 'Function definitions, arguments, return values, and scope',
    difficulty: 'Easy'
  }
];

const SessionManager = () => {
  const location = useLocation();
  const { authState } = useAuth();
  const { fetchWithAuth } = useApi();

  // Session states
  const [sessionStage, setSessionStage] = useState<'config' | 'active' | 'summary'>('config');
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    topic: '',
    questionCount: 5,
    difficulty: 'Easy'
  });
  const [sessionProgress, setSessionProgress] = useState<SessionProgress>({
    currentQuestion: 0,
    totalQuestions: 0,
    score: 0,
    timeSpent: 0,
    questionResults: [],
    topic: '',
    masteryProgress: 0
  });
  const [loading, setLoading] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState>({
    session: null,
    currentIndex: 0
  });

  // Auto-select topic if coming from dashboard
  useEffect(() => {
    const selectedTopic = location.state?.selectedTopic;
    if (selectedTopic) {
      setSessionConfig(prev => ({
        ...prev,
        topic: selectedTopic
      }));
      startSession(); // Automatically start the session
    }
  }, []);

  // Timer for session duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStage === 'active') {
      interval = setInterval(() => {
        setSessionProgress(prev => ({
          ...prev,
          timeSpent: prev.timeSpent + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStage]);

  const handleTopicSelect = (topicId: string) => {
    setSessionConfig(prev => ({
      ...prev,
      topic: topicId
    }));
  };

  const handleQuestionCountChange = (count: number) => {
    setSessionConfig(prev => ({
      ...prev,
      questionCount: count
    }));
  };

  const handleDifficultyChange = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    setSessionConfig(prev => ({
      ...prev,
      difficulty
    }));
  };

  const startSession = async () => {
    setLoading(true);
    try {
      // Debug: Log the config being sent
      console.log('Sending session config:', sessionConfig);

      // Validate config before sending
      if (!sessionConfig.topic) {
        console.error('Missing topic in config');
        return;
      }
      if (!sessionConfig.difficulty) {
        console.error('Missing difficulty in config');
        return;
      }
      if (!sessionConfig.questionCount) {
        console.error('Missing questionCount in config');
        return;
      }

      const response = await fetchWithAuth('api/sessions', {
        method: 'POST',
        body: JSON.stringify(sessionConfig)
      });
      
      const sessionData: Session = await response.json();
      
      // Debug: Log the response
      console.log('Session created:', sessionData);
      
      setSessionState({
        session: sessionData,
        currentIndex: 0
      });
      
      setSessionProgress({
        currentQuestion: 1,
        totalQuestions: sessionConfig.questionCount,
        score: 0,
        timeSpent: 0,
        questionResults: [],
        topic: sessionConfig.topic,
        masteryProgress: 0
      });
      setSessionStage('active');
    } catch (error) {
      console.error('Failed to start session:', error);
      // Add more detailed error logging
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionComplete = async (result: QuestionResult) => {
    if (!sessionState.session?.id) return;

    try {
      const response = await fetchWithAuth(
        `api/sessions/${sessionState.session.id}/questions/${result.questionId}/complete`,
        {
          method: 'POST',
          body: JSON.stringify(result)
        }
      );

      if (!response.ok) throw new Error('Failed to submit question result');
      const updatedSession: Session = await response.json();

      setSessionProgress(prev => {
        const newResults = [...prev.questionResults, result];
        const newScore = calculateScore(newResults);
        const isLastQuestion = prev.currentQuestion === prev.totalQuestions;

        if (isLastQuestion) {
          setSessionStage('summary');
        }

        return {
          ...prev,
          currentQuestion: isLastQuestion ? prev.currentQuestion : prev.currentQuestion + 1,
          score: newScore,
          questionResults: newResults,
        };
      });

      setSessionState(prev => ({
        ...prev,
        session: updatedSession,
        currentIndex: prev.currentIndex + 1
      }));

    } catch (error) {
      console.error('Failed to submit question result:', error);
    }
  };

  const calculateScore = (results: QuestionResult[]): number => {
    return results.reduce((score, result) => {
      switch (result.status) {
        case 'success': return score + 3;
        case 'warning': return score + 1;
        case 'skipped': return score - 1;
        default: return score;
      }
    }, 0);
  };

  const renderConfigStage = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Select a Topic</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_TOPICS.map(topic => (
            <Card
              key={topic.id}
              className={`p-4 cursor-pointer transition-colors ${
                sessionConfig.topic === topic.id
                  ? 'border-green-500 bg-green-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleTopicSelect(topic.id)}
            >
              <h3 className="font-medium">{topic.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
              <span className="text-xs text-green-600 mt-2 inline-block">
                {topic.difficulty}
              </span>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Session Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Number of Questions
            </label>
            <select
              className="w-full rounded-md border border-gray-300 p-2"
              value={sessionConfig.questionCount}
              onChange={(e) => handleQuestionCountChange(Number(e.target.value))}
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Difficulty
            </label>
            <div className="flex gap-2">
              {['Easy', 'Medium', 'Hard'].map((diff) => (
                <Button
                  key={diff}
                  className={`${sessionConfig.difficulty === diff ? 'bg-green-400 hover:bg-pink-400' : 'bg-gray-100'}`}
                  variant={sessionConfig.difficulty === diff ? 'default' : 'outline'}
                  onClick={() => handleDifficultyChange(diff as 'Easy' | 'Medium' | 'Hard')}
                >
                  {diff}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-pink-400 hover:bg-green-400"
        disabled={!sessionConfig.topic || loading}
        onClick={startSession}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Preparing Session...
          </>
        ) : (
          'Start Practice Session'
        )}
      </Button>
    </div>
  );

  const renderActiveStage = () => (
    sessionState.session && (
    <div className="h-[90vh] min-w-screen flex flex-col">
      <div className="rounded-xl p-4 border border-green-400">
        <div className="container mx-auto flex justify-evenly items-center gap-2">
          <div className="flex gap-4">
            <div className="text-sm font-medium">
              Question {sessionProgress.currentQuestion} of {sessionProgress.totalQuestions}
            </div>
          </div>
          <div className="text-sm font-medium">
              Score: {sessionProgress.score}
            </div>
          <div className="text-sm font-medium">
            Time: {Math.floor(sessionProgress.timeSpent / 60)}:
            {String(sessionProgress.timeSpent % 60).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <CodeChallenge 
          challenge={sessionState.session?.challenges[sessionState.currentIndex]}
          onComplete={handleQuestionComplete}
        />
      </div>
    </div>
    )
  );

  const renderSummaryStage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Session Complete!</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-medium">Final Score</h3>
          <p className="text-2xl font-bold text-green-600">{sessionProgress.score}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium">Time Spent</h3>
          <p className="text-2xl font-bold text-green-600">
            {Math.floor(sessionProgress.timeSpent / 60)}m {sessionProgress.timeSpent % 60}s
          </p>
        </Card>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Question Results</h3>
        <div className="space-y-2">
          {sessionProgress.questionResults.map((result, index) => (
            <div
              key={result.questionId}
              className={`p-3 rounded-lg ${
                result.status === 'success'
                  ? 'bg-green-50'
                  : result.status === 'warning'
                  ? 'bg-yellow-50'
                  : 'bg-red-50'
              }`}
            >
              <div className="flex justify-between">
                <span>Question {index + 1}</span>
                <span>{result.attempts} attempts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            setSessionStage('config');
            setSessionProgress({
              currentQuestion: 0,
              totalQuestions: 0,
              score: 0,
              timeSpent: 0,
              questionResults: [],
              topic: '',
              masteryProgress: 0
            });
            setSessionState({
              session: null,
              currentIndex: 0
            });
            setSessionConfig({
              topic: '',
              questionCount: 5,
              difficulty: 'Easy'
            });
          }}
        >
          New Session
        </Button>
        <Button
          className="flex-1 bg-green-400"
          onClick={() => {
            // This would start practice mode with failed questions
            console.log('Start practice mode');
          }}
        >
          Practice Failed Questions
        </Button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto p-4">
      <Card className="p-6">
        {sessionStage === 'config' && renderConfigStage()}
        {sessionStage === 'active' && renderActiveStage()}
        {sessionStage === 'summary' && renderSummaryStage()}
      </Card>
    </div>
  );
};

export default SessionManager;
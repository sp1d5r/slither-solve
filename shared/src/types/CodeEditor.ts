export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Challenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  boilerplate: string;
  topic: string;
  examples: Array<{
    input: string;
    output: string;
  }>;
  hints: string[];
}

export interface TestCase {
  input: any[];
  expected: any;
}

export interface TestResult {
  passed: boolean;
  output?: string;
  expected?: number;
  error?: string;
}

export interface SessionConfig {
  topic: string;
  difficulty: Difficulty;
  questionCount: number;
}

export interface Session {
  id: string;
  config: SessionConfig;
  challenges: string[];  // array of challenge IDs
  currentQuestion: number;
  score: number;
  startTime: Date;
  status: 'active' | 'completed' | 'paused';
}

export interface SessionProgress {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  timeSpent: number;
  questionResults: Array<QuestionResult>;
}

export interface QuestionResult {
  questionId: string;
  status: 'success' | 'warning' | 'error' | 'skipped';
  attempts: number;
  timeSpent: number;
}

export interface ExecuteCodeResponse {
  success: boolean;
  allPassed: boolean;
  results: {
    total: number;
    passed: number;
    testResults: TestResult[];
  };
}

export interface CreateSessionResponse {
  sessionId: string;
  challenges: string[];
  topic: string;
  difficulty: Difficulty;
  count: number;
}

// Types for the topic selection
export interface TopicOption {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
}
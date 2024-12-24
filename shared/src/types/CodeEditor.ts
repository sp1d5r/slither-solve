import { Identifiable } from "../services/database/DatabaseInterface";

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
  tests: TestCase[];
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

export interface Session extends Identifiable {
  userId: string;
  config: SessionConfig;
  challenges: Challenge[];
  currentQuestion: number;
  score: number;
  startTime: string;
  status: 'active' | 'completed' | 'paused';
  results: { [key: string]: QuestionResult };
}

export interface SessionProgress {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  timeSpent: number;
  questionResults: QuestionResult[];
  topic: string;
  masteryProgress: number;
}

export interface QuestionResult {
  questionId: string;
  status: 'success' | 'warning' | 'error' | 'skipped';
  attempts: number;
  timeSpent: number;
  code: string;
  testResults?: TestResult[];
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

export interface TopicProblemResult {
  problemId: string;
  lastAttempted: string;
  status: "success" | "warning" | "error" | "skipped";
  nextReviewDate?: string;  // For spaced repetition scheduling
}

export interface TopicProgress {
  totalAttempts: number;
  successfulAttempts: number;
  lastAttempted: string;
  averageTime: number;
  masteryLevel: number;
  problemResults: { [problemId: string]: TopicProblemResult };
}

export interface ProblemProgress {
  userId: string;
  problemId: string;
  attempts: number;
  lastAttempted: string;
  mastered: boolean;
  averageTime: number;
  successRate: number;
}

export interface ProblemAttempt extends Identifiable {
  userId: string;
  problemId: string;
  sessionId: string;
  code: string;
  timestamp: string;
  timeSpent: number;
  status: 'success' | 'error' | 'warning';
  errorMessage?: string;
}

export interface SessionHistoryResponse {
  sessions: SessionHistory[];
  total: number;
}

export interface ProblemHistoryResponse {
  attempts: ProblemAttempt[];
  total: number;
}

export interface SessionAttempt {
  challengeId: string;
  topic: string;
  correct: boolean;
  attemptCount: number;
  timestamp: string;
  timeSpent: number;
  code?: string;  // Optional: store the code they wrote
}

export interface SessionHistory extends Identifiable {
  userId: string;
  sessionId: string;
  timestamp: string;
  topicStudied: string;
  problemsAttempted: SessionAttempt[];
}

export interface DailyActivityStats {
  totalAttempts: number;
  totalTimeSpent: number;
  statusBreakdown: {
    success: number;
    error: number;
    warning: number;
  };
}

export interface ActivityHeatmapResponse {
  // Key is date in ISO format (YYYY-MM-DD)
  dailyActivity: { [date: string]: DailyActivityStats };
  totalProblems: number;
  totalTimeSpent: number;
  overallStatusBreakdown: {
    success: number;
    error: number;
    warning: number;
  };
}
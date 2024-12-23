import { Session, SessionConfig, QuestionResult, FirebaseDatabaseService, Challenge, TopicProgress, ProblemProgress, ProblemAttempt, SessionHistoryResponse, ProblemHistoryResponse, SessionHistory } from 'shared';
import { ChallengeService } from './challengeService';

const SESSIONS_COLLECTION = 'sessions';
const PROGRESS_COLLECTION = 'progress';
const TOPIC_PROGRESS_COLLECTION = 'topic-progress';
const PROBLEM_HISTORY_COLLECTION = 'problem-history';

export class SessionService {
  private challengeService: ChallengeService;

  constructor(challengeService: ChallengeService) {
    this.challengeService = challengeService;
  }

  async createSession(config: SessionConfig, userId: string): Promise<Session> {
    const challenges = await this.challengeService.getChallengesByTopic(config.topic);
    
    const selectedChallenges = challenges
      .filter(c => c.difficulty === config.difficulty)
      .sort(() => Math.random() - 0.5)
      .slice(0, config.questionCount);

    const session: Session = {
      id: `session-${Date.now()}`,
      userId,
      config,
      challenges: selectedChallenges,
      currentQuestion: 0,
      score: 0,
      startTime: new Date().toISOString(),
      status: 'active',
      results: {}
    };

    if (!session.id) {
      throw new Error('Session ID is required');
    }

    return new Promise((resolve, reject) => {
      FirebaseDatabaseService.updateDocument<Session>(
        SESSIONS_COLLECTION,
        session.id!,
        session,
        () => resolve(session),
        (error) => reject(error)
      );
    });
  }

  async getSession(sessionId: string): Promise<Session | null> {
    return new Promise((resolve) => {
      FirebaseDatabaseService.getDocument<Session>(
        SESSIONS_COLLECTION,
        sessionId,
        (session) => resolve(session),
        (error) => {
          console.error('Error fetching session:', error);
          resolve(null);
        }
      );
    });
  }

  async updateSession(sessionId: string, updates: Partial<Session>): Promise<Session | null> {
    return new Promise((resolve) => {
      FirebaseDatabaseService.updateDocument<Session>(
        SESSIONS_COLLECTION,
        sessionId,
        updates,
        async () => {
          const updated = await this.getSession(sessionId);
          resolve(updated);
        },
        (error) => {
          console.error('Error updating session:', error);
          resolve(null);
        }
      );
    });
  }

  async getSessionHistory(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<SessionHistoryResponse> {
    return new Promise((resolve) => {
      FirebaseDatabaseService.complexQuery<Session>(
        SESSIONS_COLLECTION,
        [
          { field: 'userId', operator: '==', value: userId },
          { field: 'status', operator: '==', value: 'completed' }
        ],
        [{ field: 'startTime', direction: 'desc' }],
        (sessions) => {
          const start = (page - 1) * limit;
          const paginatedSessions = sessions.slice(start, start + limit);
          resolve({
            sessions: paginatedSessions,
            total: sessions.length
          });
        },
        (error) => {
          console.error('Error fetching session history:', error);
          resolve({ sessions: [], total: 0 });
        }
      );
    });
  }

  async getTopicProgress(userId: string, topic: string): Promise<TopicProgress | null> {
    return new Promise((resolve) => {
      FirebaseDatabaseService.getDocument<TopicProgress>(
        TOPIC_PROGRESS_COLLECTION,
        `${userId}_${topic}`,
        (progress) => resolve(progress),
        (error) => {
          console.error('Error fetching topic progress:', error);
          resolve(null);
        }
      );
    });
  }

  async getProblemHistory(
    userId: string,
    problemId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ProblemHistoryResponse> {
    return new Promise((resolve) => {
      FirebaseDatabaseService.complexQuery<ProblemAttempt>(
        PROBLEM_HISTORY_COLLECTION,
        [
          { field: 'userId', operator: '==', value: userId },
          { field: 'problemId', operator: '==', value: problemId }
        ],
        [{ field: 'timestamp', direction: 'desc' }],
        (attempts) => {
          const start = (page - 1) * limit;
          const paginatedAttempts = attempts.slice(start, start + limit);
          resolve({
            attempts: paginatedAttempts,
            total: attempts.length
          });
        },
        (error) => {
          console.error('Error fetching problem history:', error);
          resolve({ attempts: [], total: 0 });
        }
      );
    });
  }

  private async updateTopicProgress(
    userId: string,
    topic: string,
    result: QuestionResult
  ): Promise<void> {
    return new Promise((resolve) => {
      FirebaseDatabaseService.getDocument<TopicProgress>(
        `${TOPIC_PROGRESS_COLLECTION}/${userId}/topics`,
        topic,
        async (existingProgress) => {
          const newProgress = {
            totalAttempts: (existingProgress?.totalAttempts || 0) + 1,
            successfulAttempts: (existingProgress?.successfulAttempts || 0) + (result.status === 'success' ? 1 : 0),
            lastAttempted: new Date().toISOString(),
            averageTime: existingProgress
              ? (existingProgress.averageTime * existingProgress.totalAttempts + result.timeSpent) / (existingProgress.totalAttempts + 1)
              : result.timeSpent,
            masteryLevel: 0 // Calculate based on your criteria
          };

          await FirebaseDatabaseService.updateDocument(
            `${TOPIC_PROGRESS_COLLECTION}/${userId}/topics`,
            topic,
            newProgress
          );
          resolve();
        },
        (error) => {
          console.error('Error updating topic progress:', error);
          resolve();
        }
      );
    });
  }

  private async updateUserProgress(
    userId: string, 
    challengeId: string, 
    result: QuestionResult
  ): Promise<void> {
    return new Promise((resolve) => {
      FirebaseDatabaseService.getDocument<ProblemProgress>(
        `${PROGRESS_COLLECTION}/${userId}/challenges`,
        challengeId,
        async (existingProgress) => {
          const newProgress = {
            attempts: (existingProgress?.attempts || 0) + 1,
            lastAttempted: new Date().toISOString(),
            mastered: result.status === 'success',
            averageTime: existingProgress 
              ? (existingProgress.averageTime * existingProgress.attempts + result.timeSpent) / (existingProgress.attempts + 1)
              : result.timeSpent
          };

          await FirebaseDatabaseService.updateDocument(
            `${PROGRESS_COLLECTION}/${userId}/challenges`,
            challengeId,
            newProgress
          );
          resolve();
        },
        (error) => {
          console.error('Error updating progress:', error);
          resolve();
        }
      );
    });
  }

  private async logSessionHistory(
    userId: string,
    sessionId: string,
    challenge: Challenge,
    result: QuestionResult
  ): Promise<void> {
    return new Promise((resolve) => {
      FirebaseDatabaseService.getDocument<SessionHistory>(
        `${SESSIONS_COLLECTION}/${userId}/history`,
        sessionId,
        async (existingHistory) => {
          const newAttempt = {
            challengeId: challenge.id,
            topic: challenge.topic,
            correct: result.status === 'success',
            attemptCount: result.attempts,
            timestamp: new Date().toISOString(),
            timeSpent: result.timeSpent
          };

          const updatedHistory = {
            timestamp: existingHistory?.timestamp || new Date().toISOString(),
            topicStudied: challenge.topic,
            problemsAttempted: [
              ...(existingHistory?.problemsAttempted || []),
              newAttempt
            ]
          };

          await FirebaseDatabaseService.updateDocument(
            `${SESSIONS_COLLECTION}/${userId}/history`,
            sessionId,
            updatedHistory
          );
          resolve();
        },
        (error) => {
          console.error('Error updating history:', error);
          resolve();
        }
      );
    });
  }

  private async logProblemAttempt(
    userId: string,
    challengeId: string,
    result: QuestionResult
  ): Promise<void> {
    return new Promise((resolve) => {
      const attemptId = `attempt-${Date.now()}`;
      FirebaseDatabaseService.updateDocument(
        `${PROBLEM_HISTORY_COLLECTION}/${userId}/attempts`,
        attemptId,
        {
          challengeId,
          timestamp: new Date().toISOString(),
          status: result.status,
          attempts: result.attempts,
          timeSpent: result.timeSpent,
          code: result.code,        // Store their solution
          testResults: result.testResults  // Store test results for review
        },
        () => resolve(),
        (error) => {
          console.error('Error logging problem attempt:', error);
          resolve();
        }
      );
    });
  }

  async completeQuestion(
    sessionId: string,
    questionId: string,
    result: QuestionResult,
    userId: string
  ): Promise<Session | null> {
    const session = await this.getSession(sessionId);
    if (!session) return null;

    const currentChallenge = session.challenges[session.currentQuestion];

    // Update the session
    const updatedSession = await this.updateSession(sessionId, {
      currentQuestion: session.currentQuestion + 1,
      results: {
        ...session.results,
        [questionId]: result
      }
    });

    // Update various tracking data
    await Promise.all([
      this.updateUserProgress(userId, currentChallenge.id, result),
      this.logSessionHistory(userId, sessionId, currentChallenge, result),
      this.updateTopicProgress(userId, currentChallenge.topic, result),
      this.logProblemAttempt(userId, currentChallenge.id, result)
    ]);

    return updatedSession;
  }
}

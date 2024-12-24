import { Session, SessionConfig, QuestionResult, FirebaseDatabaseService, Challenge, TopicProgress, ProblemProgress, ProblemAttempt, SessionHistoryResponse, ProblemHistoryResponse, SessionHistory, ActivityHeatmapResponse, DailyActivityStats, TopicProblemResult } from 'shared';
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
      FirebaseDatabaseService.complexQuery<SessionHistory>(
        `${SESSIONS_COLLECTION}/${userId}/history`,
        [],
        [{ field: 'timestamp', direction: 'desc' }],
        (sessions) => {
          console.log("sessions", sessions);
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

  async getTopicProgress(userId: string, topic: string): Promise<TopicProgress> {
    return new Promise((resolve) => {
      FirebaseDatabaseService.getDocument<TopicProgress>(
        `${TOPIC_PROGRESS_COLLECTION}/${userId}/topics`,
        topic,
        (progress) => resolve(progress || {
          totalAttempts: 0,
          successfulAttempts: 0,
          lastAttempted: '',
          averageTime: 0,
          masteryLevel: 0,
          problemResults: {}
        }),
        (error) => {
          console.error('Error fetching topic progress:', error);
          resolve({
            totalAttempts: 0,
            successfulAttempts: 0,
            lastAttempted: '',
            averageTime: 0,
            masteryLevel: 0,
            problemResults: {}
          });
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
        `${PROBLEM_HISTORY_COLLECTION}/${userId}/attempts`,
        [{ field: 'problemId', operator: '==', value: problemId }],
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
    result: QuestionResult,
    challengeId: string
  ): Promise<void> {
    return new Promise((resolve) => {
      FirebaseDatabaseService.getDocument<TopicProgress>(
        `${TOPIC_PROGRESS_COLLECTION}/${userId}/topics`,
        topic,
        async (existingProgress) => {
          const now = new Date().toISOString();
          
          const nextReviewDate = this.calculateNextReviewDate(
            result.status,
            result.attempts,
            existingProgress?.problemResults?.[challengeId]
          );

          // Calculate mastery by counting unique successful problems
          const updatedProblemResults = {
            ...(existingProgress?.problemResults || {}),
            [challengeId]: {
              problemId: challengeId,
              lastAttempted: now,
              status: result.status,
              attempts: result.attempts,
              nextReviewDate
            }
          };

          // Count problems that have been successfully completed at least once
          const masteryLevel = Object.values(updatedProblemResults)
            .filter(result => result.status === 'success').length;

          const newProgress = {
            totalAttempts: (existingProgress?.totalAttempts || 0) + 1,
            successfulAttempts: (existingProgress?.successfulAttempts || 0) + (result.status === 'success' ? 1 : 0),
            lastAttempted: now,
            averageTime: existingProgress
              ? (existingProgress.averageTime * existingProgress.totalAttempts + result.timeSpent) / (existingProgress.totalAttempts + 1)
              : result.timeSpent,
            masteryLevel,
            problemResults: updatedProblemResults
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

  private calculateNextReviewDate(
    status: QuestionResult['status'],
    attempts: number,
    previousResult?: TopicProblemResult,
  ): string {
    const now = new Date();
    
    // If failed or skipped, review tomorrow
    if (status === 'error' || status === 'skipped') {
      now.setDate(now.getDate() + 1);
      return now.toISOString();
    }

    // Base interval on performance
    let interval = 1;
    if (status === 'success' && attempts === 1) {
      // Perfect solution - longer interval
      interval = previousResult ? 14 : 7; // 2 weeks if repeated success, 1 week for first success
    } else if (status === 'success') {
      // Succeeded but took multiple attempts
      interval = previousResult ? 7 : 3; // 1 week if repeated success, 3 days for first success
    } else if (status === 'warning') {
      // Barely passed - shorter interval
      interval = 2; // Review in 2 days
    }

    now.setDate(now.getDate() + interval);
    return now.toISOString();
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
      this.updateTopicProgress(userId, currentChallenge.topic, result, currentChallenge.id),
      this.logProblemAttempt(userId, currentChallenge.id, result)
    ]);

    return updatedSession;
  }

  async getUserActivityHeatmap(userId: string): Promise<ActivityHeatmapResponse> {
    return new Promise((resolve) => {
      FirebaseDatabaseService.complexQuery<ProblemAttempt>(
        `${PROBLEM_HISTORY_COLLECTION}/${userId}/attempts`,
        [], // No filters, we want all attempts
        [{ field: 'timestamp', direction: 'asc' }],
        (attempts) => {
          const dailyActivity: { [date: string]: DailyActivityStats } = {};
          const overallStatusBreakdown = {
            success: 0,
            error: 0,
            warning: 0
          };
          let totalTimeSpent = 0;

          // Process each attempt
          attempts.forEach(attempt => {
            // Convert timestamp to YYYY-MM-DD
            const date = new Date(attempt.timestamp).toISOString().split('T')[0];
            
            // Initialize daily stats if needed
            if (!dailyActivity[date]) {
              dailyActivity[date] = {
                totalAttempts: 0,
                totalTimeSpent: 0,
                statusBreakdown: {
                  success: 0,
                  error: 0,
                  warning: 0
                }
              };
            }

            // Update daily stats
            dailyActivity[date].totalAttempts++;
            dailyActivity[date].totalTimeSpent += attempt.timeSpent;
            dailyActivity[date].statusBreakdown[attempt.status]++;

            // Update overall stats
            overallStatusBreakdown[attempt.status]++;
            totalTimeSpent += attempt.timeSpent;
          });

          resolve({
            dailyActivity,
            totalProblems: attempts.length,
            totalTimeSpent,
            overallStatusBreakdown
          });
        },
        (error) => {
          console.error('Error fetching activity heatmap data:', error);
          resolve({
            dailyActivity: {},
            totalProblems: 0,
            totalTimeSpent: 0,
            overallStatusBreakdown: {
              success: 0,
              error: 0,
              warning: 0
            }
          });
        }
      );
    });
  }
}

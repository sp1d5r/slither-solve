import { Session, SessionConfig, QuestionResult } from 'shared';
import { ChallengeService } from './challengeService';

// In-memory storage for sessions (replace with database in production)
const sessions: Record<string, Session> = {};

export class SessionService {
  private challengeService: ChallengeService;

  constructor(challengeService: ChallengeService) {
    this.challengeService = challengeService;
  }

  async createSession(config: SessionConfig): Promise<Session> {
    const challenges = await this.challengeService.getChallengesByTopic(config.topic);
    
    const selectedChallenges = challenges
      .filter(c => c.difficulty === config.difficulty)
      .sort(() => Math.random() - 0.5)
      .slice(0, config.questionCount);

    const session: Session = {
      id: `session-${Date.now()}`,
      config,
      challenges: selectedChallenges.map(c => c.id),
      currentQuestion: 0,
      score: 0,
      startTime: new Date(),
      status: 'active'
    };

    // Store the session
    sessions[session.id] = session;
    return session;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    return sessions[sessionId] || null;
  }

  async updateSession(sessionId: string, updates: Partial<Session>): Promise<Session | null> {
    const session = sessions[sessionId];
    if (!session) return null;

    sessions[sessionId] = {
      ...session,
      ...updates
    };

    return sessions[sessionId];
  }

  async completeQuestion(
    sessionId: string, 
    questionId: string, 
    result: QuestionResult
  ): Promise<Session | null> {
    const session = await this.getSession(sessionId);
    if (!session) return null;

    // Calculate score based on result status
    let scoreChange = 0;
    switch (result.status) {
      case 'success': scoreChange = 3; break;
      case 'warning': scoreChange = 1; break;
      case 'skipped': scoreChange = -1; break;
      default: scoreChange = 0;
    }

    // Update session with new score and progress
    return this.updateSession(sessionId, {
      score: session.score + scoreChange,
      currentQuestion: session.currentQuestion + 1,
      status: session.currentQuestion + 1 >= session.challenges.length ? 'completed' : 'active'
    });
  }

  async getSessionHistory(): Promise<Session[]> {
    // In a real app, we'd filter by userId and add pagination
    return Object.values(sessions).filter(session => session.status === 'completed');
  }
}

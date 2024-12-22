// src/controllers/sessionController.ts
import { Request, Response } from 'express';
import { SessionService } from '../services/sessionService';
import { ChallengeService } from '../services/challengeService';
import { SessionConfig, QuestionResult } from 'shared';

const challengeService = new ChallengeService();
const sessionService = new SessionService(challengeService);

export const createSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionConfig: SessionConfig = req.body;

    // Validate session config
    if (!sessionConfig.topic || !sessionConfig.difficulty || !sessionConfig.questionCount) {
      res.status(400).json({ error: 'Invalid session configuration' });
      return;
    }

    const session = await sessionService.createSession(sessionConfig);
    res.json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    
    const session = await sessionService.getSession(sessionId);
    
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const updateSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['active', 'completed', 'paused'].includes(status)) {
      res.status(400).json({ error: 'Invalid session status' });
      return;
    }

    const updatedSession = await sessionService.updateSession(sessionId, { status });
    
    if (!updatedSession) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    res.json(updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const completeQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId, questionId } = req.params;
    const result: QuestionResult = req.body;

    // Validate result
    if (!result.status || typeof result.attempts !== 'number' || typeof result.timeSpent !== 'number') {
      res.status(400).json({ error: 'Invalid question result' });
      return;
    }

    const updatedSession = await sessionService.completeQuestion(
      sessionId,
      questionId,
      result
    );

    if (!updatedSession) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    // If this was the last question, update session status
    if (updatedSession.currentQuestion >= updatedSession.challenges.length) {
      await sessionService.updateSession(sessionId, { status: 'completed' });
    }

    res.json(updatedSession);
  } catch (error) {
    console.error('Error completing question:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getSessionHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessions = await sessionService.getSessionHistory();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching session history:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};
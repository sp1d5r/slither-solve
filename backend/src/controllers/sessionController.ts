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
    const userId = req.user?.uid; // Will come from auth middleware

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Validate session config
    if (!sessionConfig.topic || !sessionConfig.difficulty || !sessionConfig.questionCount) {
      res.status(400).json({ error: 'Invalid session configuration' });
      return;
    }

    const session = await sessionService.createSession(sessionConfig, userId);
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
    const userId = req.user?.uid; // Will come from auth middleware

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Validate result
    if (!result.status || typeof result.attempts !== 'number' || typeof result.timeSpent !== 'number') {
      res.status(400).json({ error: 'Invalid question result' });
      return;
    }

    const updatedSession = await sessionService.completeQuestion(
      sessionId,
      questionId,
      result,
      userId
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
    const userId = req.user?.uid; // Will come from auth middleware
    const { page = 1, limit = 10 } = req.query;

    console.log("userId", userId);

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const sessions = await sessionService.getSessionHistory(
      userId,
      Number(page),
      Number(limit)
    );

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching session history:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getTopicProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid; // Will come from auth middleware
    const { topic } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!topic) {
      res.status(400).json({ error: 'Topic is required' });
      return;
    }

    const progress = await sessionService.getTopicProgress(userId, topic);
    
    if (!progress) {
      res.status(404).json({ error: 'No progress found for this topic' });
      return;
    }

    res.json(progress);
  } catch (error) {
    console.error('Error fetching topic progress:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getProblemHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid; // Will come from auth middleware
    const { problemId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!problemId) {
      res.status(400).json({ error: 'Problem ID is required' });
      return;
    }

    const history = await sessionService.getProblemHistory(
      userId,
      problemId,
      Number(page),
      Number(limit)
    );

    if (!history) {
      res.status(404).json({ error: 'No history found for this problem' });
      return;
    }

    res.json(history);
  } catch (error) {
    console.error('Error fetching problem history:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getActivityHeatmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const heatmapData = await sessionService.getUserActivityHeatmap(userId);
    res.json(heatmapData);
  } catch (error) {
    console.error('Error fetching activity heatmap:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};
import { Request, Response } from 'express';
import { ChallengeService } from '../services/challengeService';

const challengeService = new ChallengeService();

export const getChallengeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const challenge = await challengeService.getChallenge(id);
    
    if (!challenge) {
      res.status(404).json({ error: 'Challenge not found' });
      return;
    }

    res.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getChallengesByTopic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic } = req.params;
    
    if (!topic) {
      res.status(400).json({ error: 'Topic is required' });
      return;
    }

    const challenges = await challengeService.getChallengesByTopic(topic);

    if (challenges.length === 0) {
      res.status(404).json({ error: 'No challenges found for this topic' });
      return;
    }

    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges by topic:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const listTopics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const topics = await challengeService.listTopics();
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

// For admin purposes - might want to add auth middleware
export const createChallenge = async (req: Request, res: Response): Promise<void> => {
  try {
    const challengeData = req.body;
    
    // Validate challenge data
    if (!challengeData.title || !challengeData.description || !challengeData.topic) {
      res.status(400).json({ error: 'Missing required challenge fields' });
      return;
    }

    const challenge = await challengeService.createChallenge(challengeData);
    res.status(201).json(challenge);
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const updateChallenge = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedChallenge = await challengeService.updateChallenge(id, updateData);
    
    if (!updatedChallenge) {
      res.status(404).json({ error: 'Challenge not found' });
      return;
    }

    res.json(updatedChallenge);
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};
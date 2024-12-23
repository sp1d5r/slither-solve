import { Request, Response } from 'express';
import { ChallengeService } from '../services/challengeService';
import { Challenge } from 'shared';

const challengeService = new ChallengeService();

export const bulkUploadChallenges = async (req: Request, res: Response): Promise<void> => {
  try {
    const challenges: Challenge[] = req.body;
    
    if (!Array.isArray(challenges)) {
      res.status(400).json({ 
        error: 'Invalid request body. Expected array of challenges.' 
      });
      return;
    }

    const results = await challengeService.bulkUploadChallenges(challenges);

    res.status(200).json({
      message: 'Bulk upload completed',
      successful: results.successful.length,
      failed: results.failed.length,
      details: results
    });
  } catch (error) {
    console.error('Error uploading challenges:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};
import { Request, Response } from 'express';
import { ChallengeService } from '../services/challengeService';
import { CodeExecutionService } from '../services/codeExecutionService';

const challengeService = new ChallengeService();
const codeExecutionService = new CodeExecutionService();

export const executePythonCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, challengeId } = req.body;

    // Validate input
    if (!code || !challengeId) {
      res.status(400).json({ error: 'Missing code or challengeId' });
      return;
    }

    // Validate code safety
    const isValid = await codeExecutionService.validateCode(code);
    if (!isValid) {
      res.status(400).json({ error: 'Invalid code submitted' });
      return;
    }

    // Get test cases for this challenge
    const testCases = await challengeService.getTestCases(challengeId);
    if (testCases.length === 0) {
      res.status(404).json({ error: 'Challenge not found' });
      return;
    }

    // Run all test cases
    const results = await codeExecutionService.runTests(code, testCases);

    // Calculate overall results
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const allPassed = passedTests === totalTests;

    res.json({
      success: true,
      allPassed,
      results: {
        total: totalTests,
        passed: passedTests,
        testResults: results
      }
    });
  } catch (error) {
    console.error('Error executing Python code:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

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
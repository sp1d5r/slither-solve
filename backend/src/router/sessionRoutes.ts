import express from 'express';
import { 
  createSession, 
  getSession, 
  updateSession, 
  completeQuestion,
  getSessionHistory,
  getTopicProgress,
  getProblemHistory 
} from '../controllers/sessionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Session management
router.post('/', authenticateToken, createSession);
router.get('/:sessionId', authenticateToken, getSession);
router.put('/:sessionId', authenticateToken, updateSession);
router.post('/:sessionId/questions/:questionId/complete', authenticateToken, completeQuestion);

// History & Progress
router.get('/history', authenticateToken, getSessionHistory);
router.get('/progress/topics/:topic', authenticateToken, getTopicProgress);
router.get('/progress/problems/:problemId', authenticateToken, getProblemHistory);

export default router;
import express from 'express';
import { 
  createSession, 
  getSession, 
  updateSession, 
  completeQuestion,
  getSessionHistory,
  getTopicProgress,
  getProblemHistory,
  getActivityHeatmap 
} from '../controllers/sessionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();


// History & Progress
router.get('/history', authenticateToken, getSessionHistory);
router.get('/progress/topics/:topic', authenticateToken, getTopicProgress);
router.get('/progress/problems/:problemId', authenticateToken, getProblemHistory);

// Session management
router.post('/', authenticateToken, createSession);
router.get('/:sessionId', authenticateToken, getSession);
router.put('/:sessionId', authenticateToken, updateSession);
router.post('/:sessionId/questions/:questionId/complete', authenticateToken, completeQuestion);

// Add this with your other routes
router.get('/activity/heatmap', authenticateToken, getActivityHeatmap);

export default router;
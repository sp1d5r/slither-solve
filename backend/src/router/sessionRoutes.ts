import express from 'express';
import { 
  createSession, 
  getSession, 
  updateSession, 
  completeQuestion 
} from '../controllers/sessionController';

const router = express.Router();

router.post('/', createSession);
router.get('/:sessionId', getSession);
router.put('/:sessionId', updateSession);
router.post('/:sessionId/questions/:questionId/complete', completeQuestion);

export default router;
import express from 'express';
import { executePythonCode, getChallengeById } from '../controllers/codeController';

const router = express.Router();

router.post('/execute', executePythonCode);
router.get('/challenge/:id', getChallengeById);

export default router;
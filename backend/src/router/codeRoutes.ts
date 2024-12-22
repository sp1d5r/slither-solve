import express from 'express';
import { executePythonCode } from '../controllers/codeController';

const router = express.Router();

router.post('/execute', executePythonCode);

export default router;
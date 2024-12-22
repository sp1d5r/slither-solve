import express from 'express';
import { 
  getChallengeById, 
  getChallengesByTopic,
  listTopics,
  createChallenge,
  updateChallenge
} from '../controllers/challengeController';

const router = express.Router();

// Public routes
router.get('/topics', listTopics);
router.get('/topic/:topic', getChallengesByTopic);
router.get('/challenge/:id', getChallengeById);
router.get('/:id', getChallengeById);

// Admin routes - you might want to add auth middleware
router.post('/', createChallenge);
router.put('/:id', updateChallenge);

export default router;
import express from 'express';
import { bulkUploadChallenges } from '../controllers/adminController';
// TODO: Import admin middleware when ready
// import { adminAuthMiddleware } from '../middleware/adminAuth';

const router = express.Router();

router.post('/challenges/bulk-upload', bulkUploadChallenges);
// With middleware: 
// router.post('/challenges/bulk-upload', adminAuthMiddleware, bulkUploadChallenges);

export default router;
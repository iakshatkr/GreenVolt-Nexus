import { Router } from 'express';
import { systemController } from '../controllers/systemController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/status', asyncHandler(systemController.integrationStatus));

export { router as systemRoutes };

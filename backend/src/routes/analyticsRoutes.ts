import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController.js';
import { authorize, protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/owner', protect, authorize('station_owner', 'admin'), asyncHandler(analyticsController.ownerOverview));
router.get('/admin', protect, authorize('admin'), asyncHandler(analyticsController.adminOverview));

export { router as analyticsRoutes };


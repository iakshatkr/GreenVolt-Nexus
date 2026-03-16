import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { authorize, protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(protect, authorize('user', 'admin'));
router.get('/history', asyncHandler(paymentController.history));
router.post('/checkout/:bookingId', asyncHandler(paymentController.checkout));

export { router as paymentRoutes };


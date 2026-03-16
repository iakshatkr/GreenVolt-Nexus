import { Router } from 'express';
import { adminRoutes } from './adminRoutes.js';
import { analyticsRoutes } from './analyticsRoutes.js';
import { authRoutes } from './authRoutes.js';
import { bookingRoutes } from './bookingRoutes.js';
import { paymentRoutes } from './paymentRoutes.js';
import { stationRoutes } from './stationRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/stations', stationRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);

export { router as apiRoutes };


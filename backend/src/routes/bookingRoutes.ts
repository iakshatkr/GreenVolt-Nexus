import { Router } from 'express';
import { z } from 'zod';
import { bookingController } from '../controllers/bookingController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(protect);

router.get('/my', asyncHandler(bookingController.myBookings));
router.get('/owner', authorize('station_owner', 'admin'), asyncHandler(bookingController.ownerBookings));
router.post(
  '/',
  authorize('user', 'admin'),
  validate(
    z.object({
      body: z.object({
        stationId: z.string(),
        portNumber: z.number().int().min(1),
        startTime: z.string(),
        endTime: z.string(),
        energyRequestedKwh: z.number().min(1)
      }),
      params: z.object({}).default({}),
      query: z.object({}).default({})
    })
  ),
  asyncHandler(bookingController.create)
);
router.patch('/:id/complete', authorize('station_owner', 'admin'), asyncHandler(bookingController.complete));

export { router as bookingRoutes };


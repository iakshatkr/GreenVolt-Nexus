import { Router } from 'express';
import { z } from 'zod';
import { adminController } from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/users', asyncHandler(adminController.users));
router.get('/stations', asyncHandler(adminController.stations));
router.patch(
  '/stations/:id/approval',
  validate(
    z.object({
      body: z.object({
        approvalStatus: z.enum(['pending', 'approved', 'rejected'])
      }),
      params: z.object({ id: z.string() }),
      query: z.object({}).default({})
    })
  ),
  asyncHandler(adminController.moderateStation)
);
router.delete('/users/:id', asyncHandler(adminController.deleteUser));

export { router as adminRoutes };


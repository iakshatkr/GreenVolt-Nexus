import { Router } from 'express';
import { z } from 'zod';
import { authController } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    city: z.string().min(2),
    phone: z.string().optional(),
    role: z.enum(['user', 'station_owner']).optional()
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({})
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({})
});

router.post('/register', validate(registerSchema), asyncHandler(authController.register));
router.post('/login', validate(loginSchema), asyncHandler(authController.login));
router.get('/me', protect, asyncHandler(authController.profile));

export { router as authRoutes };


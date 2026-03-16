import { Router } from 'express';
import { z } from 'zod';
import { stationController } from '../controllers/stationController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const stationBody = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  city: z.string().min(2),
  address: z.string().min(5),
  latitude: z.number(),
  longitude: z.number(),
  solarCapacityKw: z.number().min(1),
  chargingPorts: z.number().int().min(1),
  connectorTypes: z.array(z.string()).min(1),
  pricePerKwh: z.number().min(1),
  amenities: z.array(z.string()).default([]),
  operatingHours: z.object({
    open: z.string(),
    close: z.string()
  }),
  availability: z.array(
    z.object({
      day: z.string(),
      startTime: z.string(),
      endTime: z.string()
    })
  )
});

router.get('/', asyncHandler(stationController.list));
router.get('/owner/list', protect, authorize('station_owner', 'admin'), asyncHandler(stationController.ownerStations));
router.get('/:id', asyncHandler(stationController.getById));
router.post(
  '/',
  protect,
  authorize('station_owner', 'admin'),
  validate(z.object({ body: stationBody, params: z.object({}).default({}), query: z.object({}).default({}) })),
  asyncHandler(stationController.create)
);
router.put(
  '/:id',
  protect,
  authorize('station_owner', 'admin'),
  validate(
    z.object({
      body: stationBody.partial(),
      params: z.object({ id: z.string() }),
      query: z.object({}).default({})
    })
  ),
  asyncHandler(stationController.update)
);

export { router as stationRoutes };


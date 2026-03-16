import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { analyticsService } from '../services/analyticsService.js';

export const analyticsController = {
  ownerOverview: async (req: Request, res: Response) => {
    const analytics = await analyticsService.ownerOverview(req.user!.id);
    res.status(StatusCodes.OK).json({ success: true, data: analytics });
  },

  adminOverview: async (_req: Request, res: Response) => {
    const analytics = await analyticsService.adminOverview();
    res.status(StatusCodes.OK).json({ success: true, data: analytics });
  }
};


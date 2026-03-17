import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { systemService } from '../services/systemService.js';

export const systemController = {
  integrationStatus: async (_req: Request, res: Response) => {
    const status = await systemService.integrationStatus();
    res.status(StatusCodes.OK).json({
      success: true,
      data: status
    });
  }
};

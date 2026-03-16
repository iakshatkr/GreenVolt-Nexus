import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { paymentService } from '../services/paymentService.js';

export const paymentController = {
  checkout: async (req: Request, res: Response) => {
    const payment = await paymentService.checkout(String(req.params.bookingId), req.user!.id);
    res.status(StatusCodes.OK).json({ success: true, data: payment });
  },

  history: async (req: Request, res: Response) => {
    const payments = await paymentService.history(req.user!.id);
    res.status(StatusCodes.OK).json({ success: true, data: payments });
  }
};


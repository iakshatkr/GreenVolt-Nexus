import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { bookingService } from '../services/bookingService.js';

export const bookingController = {
  create: async (req: Request, res: Response) => {
    const booking = await bookingService.create({
      ...req.body,
      userId: req.user!.id
    });

    res.status(StatusCodes.CREATED).json({ success: true, data: booking });
  },

  myBookings: async (req: Request, res: Response) => {
    const bookings = await bookingService.getUserBookings(req.user!.id);
    res.status(StatusCodes.OK).json({ success: true, data: bookings });
  },

  ownerBookings: async (req: Request, res: Response) => {
    const bookings = await bookingService.getOwnerBookings(req.user!.id);
    res.status(StatusCodes.OK).json({ success: true, data: bookings.filter((item) => item.station) });
  },

  complete: async (req: Request, res: Response) => {
    const booking = await bookingService.markCompleted(String(req.params.id));
    res.status(StatusCodes.OK).json({ success: true, data: booking });
  }
};


import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { stationService } from '../services/stationService.js';

export const stationController = {
  list: async (req: Request, res: Response) => {
    const stations = await stationService.list({
      city: req.query.city as string | undefined,
      search: req.query.search as string | undefined,
      lat: req.query.lat ? Number(req.query.lat) : undefined,
      lng: req.query.lng ? Number(req.query.lng) : undefined,
      radiusKm: req.query.radiusKm ? Number(req.query.radiusKm) : undefined,
      approvalStatus: req.user?.role === 'admin' ? (req.query.approvalStatus as string | undefined) : undefined
    });

    res.status(StatusCodes.OK).json({ success: true, data: stations });
  },

  getById: async (req: Request, res: Response) => {
    const station = await stationService.getById(String(req.params.id));
    res.status(StatusCodes.OK).json({ success: true, data: station });
  },

  create: async (req: Request, res: Response) => {
    const station = await stationService.create({
      ...req.body,
      ownerId: req.user!.id
    });

    res.status(StatusCodes.CREATED).json({ success: true, data: station });
  },

  update: async (req: Request, res: Response) => {
    const station = await stationService.update(
      String(req.params.id),
      req.user!.id,
      req.user!.role,
      req.body
    );
    res.status(StatusCodes.OK).json({ success: true, data: station });
  },

  ownerStations: async (req: Request, res: Response) => {
    const stations = await stationService.list({
      ownerId: req.user!.id,
      approvalStatus: req.query.approvalStatus as string | undefined
    });

    res.status(StatusCodes.OK).json({ success: true, data: stations });
  }
};


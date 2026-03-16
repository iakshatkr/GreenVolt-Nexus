import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { adminService } from '../services/adminService.js';
import { stationService } from '../services/stationService.js';

export const adminController = {
  users: async (_req: Request, res: Response) => {
    const users = await adminService.users();
    res.status(StatusCodes.OK).json({ success: true, data: users });
  },

  stations: async (_req: Request, res: Response) => {
    const stations = await adminService.stations();
    res.status(StatusCodes.OK).json({ success: true, data: stations });
  },

  moderateStation: async (req: Request, res: Response) => {
    const station = await stationService.changeApproval(
      String(req.params.id),
      String(req.body.approvalStatus)
    );
    res.status(StatusCodes.OK).json({ success: true, data: station });
  },

  deleteUser: async (req: Request, res: Response) => {
    const result = await adminService.deleteUser(String(req.params.id));
    res.status(StatusCodes.OK).json({ success: true, data: result });
  }
};


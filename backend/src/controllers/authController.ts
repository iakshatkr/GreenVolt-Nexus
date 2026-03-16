import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/authService.js';

export const authController = {
  register: async (req: Request, res: Response) => {
    const payload = await authService.register(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: payload });
  },

  login: async (req: Request, res: Response) => {
    const payload = await authService.login(req.body);
    res.status(StatusCodes.OK).json({ success: true, data: payload });
  },

  profile: async (req: Request, res: Response) => {
    const profile = await authService.getProfile(req.user!.id);
    res.status(StatusCodes.OK).json({ success: true, data: profile });
  }
};


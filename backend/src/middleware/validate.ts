import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/apiError.js';

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      return next(
        new ApiError(StatusCodes.BAD_REQUEST, 'Validation failed', result.error.flatten())
      );
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query as Request['query'];
    next();
  };

